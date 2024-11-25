
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


// let getExnRef = function() {
//   let tag = new WebAssembly.Tag({parameters: []});
//   return new WebAssembly.Exception(tag, []);
// }

// // Helper module to produce an exnref or convert a JS value to an exnref.
// let helper = (function () {
//   let builder = new WasmModuleBuilder();
//   let tag_index = builder.addTag(kSig_v_v);
//   let throw_index = builder.addImport('m', 'import', kSig_v_r);
//   builder.addFunction('get_exnref', makeSig([], [kWasmExnRef]))
//     .addBody([
//       kExprTryTable, kWasmVoid, 1,
//       kCatchAllRef, 0,
//       kExprThrow, tag_index,
//       kExprEnd,
//       kExprUnreachable,
//     ]).exportFunc();
//   builder.addFunction('to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]))
//     .addBody([
//       kExprTryTable, kWasmVoid, 1,
//       kCatchAllRef, 0,
//       kExprLocalGet, 0,
//       kExprCallFunction, throw_index,
//       kExprEnd,
//       kExprUnreachable,
//     ]).exportFunc();
//   function throw_js(r) { throw r; }
//   let instance = builder.instantiate({m: {import: throw_js}});
//   return instance;
// })();


let builder = new WasmModuleBuilder();
function throw_js_wasm(r) { 
  console.log("================ throw_js object =================");
  throw r; } // this show the wasm obj
let throw_js_wrapper = Function.prototype.call.bind(throw_js_wasm);

// let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));
builder.addStruct([makeField(kWasmExnRef, true)]);//builder.addStruct([makeField(kWasmI32, true)]);
builder.addStruct([makeField(wasmRefNullType(0), true)]);
builder.addStruct([makeField(wasmRefNullType(1), false)]);
builder.addStruct([makeField(wasmRefNullType(2), false)]);
builder.addStruct([makeField(wasmRefNullType(3), false)]);

builder.addTable(wasmRefType(0), 1, 2, [kGCPrefix, kExprStructNewDefault, 0]);

builder.addFunction("main", makeSig([], []) /* sig */)
  .addBodyWithEnd([
    kExprI32Const, 0,  // i32.const
    kExprTableGet, 0x0,  // table.get
    kGCPrefix, kExprStructGet, 0x00, 0x00,
    kExprThrowRef,
    kExprDrop,
    kExprEnd,
  ]).exportFunc();

// builder.addExport('main', 0);
// const instance = builder.instantiate();
// let m = null;
// %DebugPrint(m);
let instance = builder.instantiate({m: {import: throw_js_wrapper}});
print(instance.exports.main());