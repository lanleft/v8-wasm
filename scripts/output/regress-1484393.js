// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");



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
  function throw_js(r) {
    console.log("================ throw_js =================");
    %DebugPrint(r);
      r = null;
     throw r; }
  let instance = builder.instantiate({m: {import: throw_js}});
  return instance;
})();


let builder = new WasmModuleBuilder();
let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));


builder.addMemory(1, 10);
let tag0 = builder.addTag(kSig_v_l);
let tag_index = builder.addTag(kSig_v_v);

// builder.addStruct([]);
// builder.addStruct([makeField(wasmRefType(kWasmFuncRef), false)], 0);
// builder.addStruct([], 0);
// builder.addArray(kWasmI32, true);
// builder.addType(makeSig([], [kWasmI32]));

// builder.addFunction('nullCastToExnRef', kSig_v_v)
// .addLocals(kWasmExnRef, 1)
// .addBody([
//     kExprLocalGet, 0,
//     kGCPrefix, kExprRefCast, kExnRefCode,
//     kExprThrowRef])
// .exportFunc();

// builder.addFunction('castNullToExnRef',
//   makeSig([kWasmExternRef], []))
// .addBody([
//     kExprLocalGet, 0,
//     kExprCallFunction, to_exnref,
//     kGCPrefix, kExprRefCastNull, kExnRefCode,
//     kExprThrowRef])
// .exportFunc();

// builder.addFunction("main", makeSig([kWasmExternRef], []))
// .addBody([
//   kExprTry, kWasmVoid,
//     kExprLocalGet, 0,
//     kExprCallFunction, to_exnref,
//     kGCPrefix, kExprRefCastNull, kNullExnRefCode, // kNoExn
//     kExprThrowRef, tag_index,
//   kExprCatch, tag_index,
//     kExprI32Const, 42,
//     kExprReturn,
//   kExprEnd,
//   kExprI32Const, 123,
// ]).exportFunc();

builder.addFunction('main',
  makeSig([kWasmExternRef], []))
.addBody([
    kExprLocalGet, 0,
    kExprCallFunction, to_exnref,
    kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprThrowRef])
.exportFunc();



// builder.addFunction("main", kSig_i_v).exportFunc().addBody([
//   kExprTry, kWasmVoid,
//     kExprI32Const, 0,
//     kAtomicPrefix, kExprI64AtomicLoad8U, 0 /*align*/, 0 /*offset*/,
//     kExprThrow, tag0,
//   kExprCatch, tag0,
//     kExprI32Const, 42,
//     kExprReturn,
//   kExprEnd,
//   kExprI32Const, 123,
// ]);


let obj = {};
%DebugPrint(obj);
console.log("=======================================");
let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref}});
console.log(instance.exports.main(obj));
