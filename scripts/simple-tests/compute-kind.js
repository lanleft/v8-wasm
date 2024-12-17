
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let tag_index = builder.addTag(makeSig([], []));
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));
  builder.addFunction('get_exnref', makeSig([], [kWasmExnRef]))
    .addLocals(kWasmNullExnRef, 1)
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprThrow, tag_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();

  function throw_js(r) {
    console.log("================ throw_js object =================");
    %DebugPrint(r);
    //   r = null;
     throw r; }
  let throw_js_wrapper = Function.prototype.call.bind(throw_js);
  let instance = builder.instantiate({m: {import: throw_js_wrapper}});
  return instance;
})();
