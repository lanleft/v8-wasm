
/// Flags: --experimental-wasm-exnref --allow-natives-syntax

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

const builder = new WasmModuleBuilder();

builder.addStruct([makeField(wasmRefNullType(kWasmNullExnRef), false)]);

builder.addTable(wasmRefType(0), 1, 2, [kGCPrefix, kExprStructNewDefault, 0]);

builder.addFunction(undefined, makeSig([], [kWasmNullExnRef]) /* sig */)
  .addBodyWithEnd([
kExprI32Const, 0,  // i32.const
kExprTableGet, 0x0,  // table.get
kGCPrefix, kExprStructGet, 0x00, 0x00,  // struct.get
kExprEnd,
]);


builder.addExport('main', 0);
const instance = builder.instantiate();
var wasm_null = instance.exports.main();
wasm_null.a;
