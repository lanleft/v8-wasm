// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test8.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --expose-gc --wasm-inlining --experimental-wasm-jspi --turboshaft-wasm

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let throw_index = builder.addImport('m', 'throw_func', makeSig([kWasmExternRef], []));
  let tag_index = builder.addTag(makeSig([], []));

  builder.addFunction('get_exnref', makeSig([], [kWasmExnRef]))
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprThrow, tag_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();

  builder.addFunction('to_exnref', makeSig([], [kWasmExnRef]))
      .addLocals(kWasmExternRef, 1)
      .addBody([
        kExprTryTable, kWasmVoid, 1,
        kCatchAllRef, 0,
        kExprLocalGet, 0,
        kExprCallFunction, throw_index,// call js throw_js_eh
        kExprEnd,
        kExprUnreachable,
      ]).exportFunc();

  function throw_func_js(r) {
    console.log("================ throw_js1111 object =================");
    // r = null;
    %DebugPrint(r);
     throw r; }
//   let throw_js_wrapper = Function.prototype.call.bind(throw_js_eh); // 
//   function throw_js_wasm(r) {throw new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []);};

  let instance = builder.instantiate({m: {throw_func: Function.prototype.call.bind(throw_func_js)}});
  return instance;
})();

function throw_js_eh222(r) {
    console.log("================ throw_js22222 object =================");
    %DebugPrint(r);
     throw r; }

let builder = new WasmModuleBuilder();
let to_exnref = builder.addImport('m', 'to_exnref', makeSig([], [kWasmExnRef]));
let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));

let throw2 = builder.addImport('m', 'throw_js_eh222', makeSig([kWasmExnRef], []));


builder.addMemory(1, 10);

builder.addFunction('main',
  makeSig([], []))
.addBody([

    kExprCallFunction, to_exnref,
    kGCPrefix, kExprRefCast, kExnRefCode,
    kExprThrowRef])// call wasm rethrow
.exportFunc();
  
builder.addFunction('nullCastNullToExnRef', kSig_v_v)
.addLocals(kWasmExnRef, 1)
.addBody([
  kExprLocalGet, 0,
  kGCPrefix, kExprRefCastNull, kNullExnRefCode,
  kExprCallFunction, throw2,
  // kExprThrowRef
]).exportFunc();

let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref, get_exnref: helper.exports.get_exnref, throw_js_eh222: Function.prototype.call.bind(throw_js_eh222)}});
// each import function call `=== ../../src/wasm/function-body-decoder-impl.h:3534` 1 time

// let obj = {};
// console.log("================== begining object =====================");
// %DebugPrint(obj);

// instance.exports.main(obj);
try {
  // instance.exports.main();
  instance.exports.nullCastNullToExnRef();
} catch (e) {
    console.log("================== catch object =====================");
    console.log(e);
    %DebugPrint(e);
    console.log(e.a.b);
    // %SystemBreak();
}

// ==> ko di qua wrapper -> throw exception chinh la `obj`
// ==> di qua wrapper    -> throw exception la `#undefined` 