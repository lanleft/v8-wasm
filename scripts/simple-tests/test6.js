// Flags: --turboshaft-wasm 
// scripts/output/regress-1484393.js

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test6.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --expose-gc --wasm-inlining --experimental-wasm-jspi --turboshaft-wasm

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let tag_index = builder.addTag(makeSig([], []));
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));

  builder.addFunction('get_exnref', makeSig([], [kWasmExnRef]))
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprThrow, tag_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();
  builder.addFunction('to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]))
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprLocalGet, 0,
          kExprCallFunction, throw_index, 
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();
//   function throw_js_eh(r) {  throw Error('test'); } 
//   function throw_js_wasm(r) { throw new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []); } // this show the js obj
function throw_js_wasm(r) { 
    console.log("================ throw_js object =================");
    %DebugPrint(r);
    throw r; } // this show the wasm obj
  let throw_js_wrapper = Function.prototype.call.bind(throw_js_wasm);
  print ("444");
  let instance = builder.instantiate({m: {import: throw_js_wrapper}});
  print("555");
  return instance;
})();


  let builder = new WasmModuleBuilder();
  let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));
  let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));


  builder.addFunction('castToExnRef',
      makeSig([kWasmExternRef], []))
    .addBody([
        kExprLocalGet, 0,
        // kExprCallFunction, get_exnref,
        // kGCPrefix, kExprRefCastNull, kExnRefCode,
        kExprCallFunction, to_exnref,
        kGCPrefix, kExprRefCast, kExnRefCode,
        kExprThrowRef])
    .exportFunc();
   
  print("666");
  let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref, get_exnref: helper.exports.get_exnref}});
  print("777");
  let wasm = instance.exports;
  print("888");
  // let wasm_exnref = new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []);
  const wasm_caller = () => instance.exports.castToExnRef(null);
  print("999");
  wasm_caller();
  print("101010");

