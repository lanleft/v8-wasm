// Copyright 2023 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --experimental-wasm-stringref
// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output4/regress-crbug-1466312.js --experimental-wasm-stringref --allow-natives-syntax

d8.file.execute('test/mjsunit/wasm/wasm-module-builder.js');

function throw_js_eh222(r) {
  console.log("================ throw_js22222 object =================");
  %DebugPrint(r);
   throw r; }

const builder = new WasmModuleBuilder();
let throw2 = builder.addImport('m', 'throw_js_eh222', makeSig([kWasmStringRef], []));


builder.addFunction("main", makeSig([kWasmStringRef], [])).exportFunc()
  .addBodyWithEnd([
    kExprLocalGet, 0,
    // ...GCInstr(kExprStringAsIter),
    // kGCPrefix, kExprRefTestNull, kAnyRefCode,
    kExprCallFunction, throw2,
    kExprEnd,
  ]);
const instance = builder.instantiate({m: {throw_js_eh222: Function.prototype.call.bind(throw_js_eh222)}});
// assertEquals(0, instance.exports.main("foo"));
// console.log(instance.exports.main(null));

try {
  instance.exports.main(null);
} catch (e) {
  console.log("================== catch object =====================");
  console.log(e);
  %DebugPrint(e);
}


