// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

let builder = new WasmModuleBuilder();

builder.addMemory(1, 10);
let tag0 = builder.addTag(kSig_v_l);
let tag_index = builder.addTag(kSig_v_v);


// builder.addFunction('nullCastToExnRef', kSig_v_v)
// .addLocals(kWasmExnRef, 1)
// .addBody([
//     kExprLocalGet, 0,
//     kGCPrefix, kExprRefCast, kExnRefCode,
//     kExprThrowRef])
// .exportFunc();

builder.addFunction("main", kSig_i_v)
.addLocals(kWasmExnRef, 1)
.addBody([
  kExprTry, kWasmVoid,
    kExprLocalGet, 0,
    kGCPrefix, kExprRefCast, kExnRefCode,
    kExprThrowRef,
  kExprCatch, tag0,
    kExprI32Const, 42,
    kExprReturn,
  kExprEnd,
  kExprI32Const, 123,
])
.exportFunc();


console.log(builder.instantiate().exports.main());
