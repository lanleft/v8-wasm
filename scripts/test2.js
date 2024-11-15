d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

let getExnRef = function() {
let tag = new WebAssembly.Tag({parameters: []});
return new WebAssembly.Exception(tag, []);
}

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
let builder = new WasmModuleBuilder();
let tag_index = builder.addTag(kSig_v_v);
let throw_index = builder.addImport('m', 'import', kSig_v_r);
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
function throw_js(r) { throw r; }
let instance = builder.instantiate({m: {import: throw_js}});
return instance;
})();


(function RefCastExnRef() {
    print(arguments.callee.name);
    let builder = new WasmModuleBuilder();
    let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));
  
    builder.addFunction('castNullToNullExnRef',
      makeSig([kWasmExternRef], []))
    .addBody([
        kExprLocalGet, 0,
        kExprCallFunction, to_exnref,
        kGCPrefix, kExprRefCastNull, kNullExnRefCode,
        kGCPrefix, kExprRefCastNull, kExnRefCode,
        kExprThrowRef])
    .exportFunc();
  

    builder.addFunction('nullCastNullToNullExnRef', kSig_v_v)
      .addLocals(kWasmExnRef, 1)
      .addBody([
        kExprLocalGet, 0,
        kGCPrefix, kExprRefCastNull, kNullExnRefCode,
        kGCPrefix, kExprRefCastNull, kExnRefCode,
        kExprThrowRef])
      .exportFunc();
    
  
    let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref}});
    let wasm = instance.exports;
  
    let obj = {};

    wasm.castNullToNullExnRef(obj);
    
    // for (let i = 0; i < 100000; i++) {
    //     try {
    //             wasm.castNullToNullExnRef(obj);
    //     } catch (e) {
    //         // console.log(e);

    //     }
    // }

  })();