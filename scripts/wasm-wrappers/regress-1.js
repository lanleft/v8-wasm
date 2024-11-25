
// Flags: --wasm-wrapper-tiering-budget=1

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

const builder = new WasmModuleBuilder();
// let kSig_v_v = makeSig([], []);
const type = builder.addType(kSig_v_v);
const __v_44 = builder.addImport('m', 'foo', kSig_v_v);
const table = builder.addTable(kWasmAnyFunc, 10).index;
builder.addActiveElementSegment(table, wasmI32Const(0), [__v_44]);
builder.addFunction('main', kSig_v_v)
    .addBody([
      kExprI32Const, 0, kExprTableGet, table, kGCPrefix, kExprRefCast, type,
      kExprCallRef, type
    ])
    .exportFunc();
const instance = builder.instantiate({'m': {'foo': () => 15}});
instance.exports.main();