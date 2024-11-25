// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test4.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --expose-gc --wasm-inlining --experimental-wasm-jspi --turboshaft-wasm

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

  function throw_js_eh(r) {
    console.log("================ throw_js object =================");
    %DebugPrint(r);
     throw r; }
  let throw_js_wrapper = Function.prototype.call.bind(throw_js_eh);
  function throw_js_wasm(r) {throw new WebAssembly.Exception(new WebAssembly.Tag({parameters: []}), []);};
  let instance = builder.instantiate({m: {import: throw_js_wrapper}});
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
    kGCPrefix, kExprRefCast, kExnRefCode,
    kExprThrowRef])
.exportFunc();


let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref}});

let obj = {};
// %DebugPrint(obj);
console.log("==================begining object =====================");

// instance.exports.main(obj);
try {
  instance.exports.main(obj);
} catch (e) {
    console.log("==================catch object =====================");
    console.log(e);
    %DebugPrint(e);
    console.log(e.a.b.c);
    // %SystemBreak();
}

