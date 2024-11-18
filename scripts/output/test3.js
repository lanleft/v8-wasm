// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax
// scripts/output/regress-1484393.js

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
  let instance = builder.instantiate({m: {import: throw_js}});
  return instance;
})();

let builder = new WasmModuleBuilder();
let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));

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

try {
    wasm.main();
} catch (e) {
    console.log("===================== catch obj==================");
    console.log(e);
}
