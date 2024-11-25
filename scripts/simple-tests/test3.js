// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax
// scripts/output/regress-1484393.js

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test3.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --expose-gc --wasm-inlining --experimental-wasm-jspi --turboshaft-wasm

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

let builder = new WasmModuleBuilder();
let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));
let tag_index = builder.addTag(makeSig([], []));


builder.addFunction('main',
    makeSig([], []))
.addBody([
    kExprCallFunction, get_exnref,
    kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprThrowRef])
.exportFunc();

// let obj = {};
// console.log("===================== begining obj==================");
// %DebugPrint(obj);
let instance = builder.instantiate({m: {get_exnref: helper.exports.get_exnref}});
let wasm = instance.exports;


wasm.main();

// try {
//     wasm.main();
// } catch (e) {
//     console.log("===================== catch obj==================");
//     console.log(e);
// }
