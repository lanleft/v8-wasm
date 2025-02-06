
/// Flags: --experimental-wasm-exnref --allow-natives-syntax

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


let global = new WebAssembly.Global({value: 'exnref', mutable: true});
let builder = new WasmModuleBuilder();
let $g = builder.addImportedGlobal('import', 'global', kWasmExnRef, true);

builder.addFunction('f', kSig_v_v).addBody([
  kExprGlobalGet, $g,
  kExprThrowRef,
]).exportFunc();

let instance = builder.instantiate({import: {global}});
let {f} = instance.exports;

try {
  f();
} catch (e) {
  %DebugPrint(e);
  e.a;
}