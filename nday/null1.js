d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

let builder = new WasmModuleBuilder();
let $t = builder.addTable(kWasmNullExnRef, 1, 1).exportAs('table'); // WasmNull

builder.addFunction('f', kSig_v_v).addBody([
  ...wasmI32Const(0),
  kExprTableGet, $t.index,
  kExprThrowRef,
]).exportFunc();

let instance = builder.instantiate();
let {f} = instance.exports;

try {
  f();
} catch (e) {
  // %DebugPrint(e);
  e.a;
}