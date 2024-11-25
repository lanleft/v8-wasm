// Flags: --turboshaft-wasm 
// scripts/output/regress-1484393.js

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test6.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --expose-gc --wasm-inlining --experimental-wasm-jspi --turboshaft-wasm

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  print("helper");
  let builder = new WasmModuleBuilder();
  let tag_index = builder.addTag(makeSig([], []));
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));
  print("111")
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

  builder.addFunction('to_exnref2', makeSig([kWasmExnRef], [kWasmExnRef]))
  .addBody([
    kExprLocalGet, 0,
    kGCPrefix, kExprRefCast, kExnRefCode,
    kExprThrowRef,
  ]).exportFunc();
  // function throw_js_eh(r) {  throw Error('test'); } 
  // function throw_js_wasm(r) { throw new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []); } // this show the js obj
  print("222")
function throw_js_wasm(r) {throw r; } // this show the wasm obj
  // throw Exception object

    
  print("333");
  let throw_js_wrapper = Function.prototype.call.bind(throw_js_wasm);
  print ("444");
  let instance = builder.instantiate({m: {import: throw_js_wrapper}});
  print("555");
  return instance;
})();


  let builder = new WasmModuleBuilder();
  let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));
  let to_exnref2 = builder.addImport('m', 'to_exnref2', makeSig([kWasmExnRef], [kWasmExnRef]));
  let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));


  builder.addFunction('castToExnRef',
      makeSig([kWasmExternRef], []))
    .addBody([
        kExprLocalGet, 0,
        kExprCallFunction, to_exnref,
        kGCPrefix, kExprRefCast, kExnRefCode,
        kExprThrowRef])
    .exportFunc();
   
    
  let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref, get_exnref: helper.exports.get_exnref, to_exnref2: helper.exports.to_exnref2}});
  let wasm = instance.exports;
  // let wasm_exnref = new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []);
  let obj = {};
  const wasm_caller = () => instance.exports.castToExnRef(obj);


