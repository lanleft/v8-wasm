

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


let bases = [4294967296n];
let expects = [0n];

for (let i = 0; i < bases.length; ++i) {
  let builder = new WasmModuleBuilder();
  let g0 = builder.addImportedGlobal("mod", "g0", kWasmI64, true);
  builder.addExportOfKind('g0', kExternalGlobal, g0);

  builder.addFunction("trunci64", kSig_v_v)
    .addBody([
      kExprGlobalGet, g0,
      kExprI32ConvertI64,
      kExprI64SConvertI32,
      kExprGlobalSet, g0,
    ]).exportAs("trunci64");

  let to_imported =
      new WebAssembly.Global({value: 'i64', mutable: true}, bases[i]);
  %DebugPrint(to_imported);
  let instance = builder.instantiate({mod: { g0: to_imported }});

  %DebugPrint(instance);
  %SystemBreak();
  // assertEquals(bases[i], instance.exports.g0.value);
  instance.exports.trunci64();
  // %DebugPrint( instance.exports.g0.value );
  // assertEquals(expects[i], instance.exports.g0.value);
}