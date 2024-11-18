// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));

  builder.addFunction('to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]))
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprLocalGet, 0,
          kExprCallFunction, throw_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();

  function throw_js(r) {
    console.log("================ throw_js object =================");
    %DebugPrint(r);
    // r = kWasmNullExternRef;
     throw r; }
  let instance = builder.instantiate({m: {import: throw_js}});
  return instance;
})();


let builder = new WasmModuleBuilder();
let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));


builder.addMemory(1, 10);

builder.addFunction('main',
  makeSig([kWasmExternRef], []))
.addBody([
    kExprLocalGet, 0,
    kExprCallFunction, to_exnref,
    kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprThrowRef])
.exportFunc();


let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref}});

let obj = {};
%DebugPrint(obj);
console.log("==================begining object =====================");

try {
  instance.exports.main(obj);
} catch (e) {
    console.log("==================catch object =====================");
    console.log(e);
    // %DebugPrint(e);
}

