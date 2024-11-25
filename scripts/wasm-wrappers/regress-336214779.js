// Copyright 2024 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//
// Flags: --jit-fuzzing --allow-natives-syntax --experimental-wasm-exnref
// Flags: --expose-gc

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

d8.file.execute("test/mjsunit/wasm/exceptions-utils.js");

(function Regress336214779() {
  print(arguments.callee.name);
  let builder = new WasmModuleBuilder();
  // let kSig_v_r = makeSig([kWasmExternRef], []);
  let tag_index = builder.addImportedTag("", "tag", makeSig([kWasmExternRef], []));

  function throw_ref_js(x) {
    %ScheduleGCInStackCheck();
    throw x;
  }
  // let kSig_r_r = makeSig([kWasmExternRef], [kWasmExternRef]);
  let kJSThrowRef = builder.addImport("", "throw_ref", makeSig([kWasmExternRef], [kWasmExternRef]));
  // let kSig_r_v = makeSig([], [kWasmExternRef]);
  let try_sig_index = builder.addType(makeSig([], [kWasmExternRef]));

  builder.addFunction("test", makeSig([kWasmExternRef], [kWasmExternRef]))
    .addBody([
      kExprTryTable, try_sig_index, 1,
      kCatchNoRef, tag_index, 0,
        kExprLocalGet, 0,
        kExprCallFunction, kJSThrowRef,
      kExprEnd,
    ])
    .exportFunc();

  let tag_js = new WebAssembly.Tag({parameters: ['externref'], results: []});
  let instance = builder.instantiate({"": {
      throw_ref: throw_ref_js,
      tag: tag_js,
  }});

  let obj = new WebAssembly.Exception(tag_js, [{}]);
  // instance.exports.test(null);
  instance.exports.test(obj);
})();
