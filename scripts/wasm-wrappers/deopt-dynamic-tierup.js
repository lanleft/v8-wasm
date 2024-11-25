// Copyright 2024 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --wasm-deopt --allow-natives-syntax --turboshaft-wasm
// Flags: --wasm-inlining --liftoff
// Flags: --turboshaft-wasm-instruction-selection-staged
// Flags: --wasm-tiering-budget=1000 --wasm-dynamic-tiering
// Flags: --no-predictable

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/wasm-wrappers/deopt-dynamic-tierup.js --wasm-deopt --allow-natives-syntax --turboshaft-wasm


d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// (function TestDeoptTieringBudget() {
//   // This can be non-zero in certain variants (e.g. `code_serializer`).
//   let initialDeoptCount = %WasmDeoptsExecutedCount();

//   var builder = new WasmModuleBuilder();
//   let funcRefT = builder.addType(makeSig([kWasmI32, kWasmI32], [kWasmI32]));
//   let funcRefT2 = builder.addType(makeSig([kWasmExternRef], [kWasmExnRef]));

//   let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));

//   builder.addFunction("add", funcRefT)
//     .addBody([kExprLocalGet, 0, kExprLocalGet, 1, kExprI32Add])
//     .exportFunc();
//   builder.addFunction("mul", funcRefT)
//     .addBody([kExprLocalGet, 0, kExprLocalGet, 1, kExprI32Mul])
//     .exportFunc();

//     builder.addFunction('to_exnref', funcRefT2)
//     .addBody([
//         kExprTryTable, kWasmVoid, 1,
//         kCatchAllRef, 0,
//         kExprLocalGet, 0,
//         kExprCallFunction, throw_index, 
//         kExprEnd,
//         kExprUnreachable,
//     ]).exportFunc();


//   let mainSig =
//     makeSig([kWasmExternRef, wasmRefType(funcRefT2)], []);
//   builder.addFunction("main", mainSig)
//   .addBody([
//     kExprLocalGet, 0,
//     kExprCallRef, funcRefT2,
//   ]).exportFunc();

//   let wasm = builder.instantiate().exports;
//   // assertEquals(initialDeoptCount, %WasmDeoptsExecutedCount());
//   print("Running until tier up");
//   while (!%IsTurboFanFunction(wasm.main)) {
//     wasm.main(null, wasm.to_exnref);
//   }
// })();



(function TestDeoptTieringBudget() {
  // This can be non-zero in certain variants (e.g. `code_serializer`).
  // let initialDeoptCount = %WasmDeoptsExecutedCount();

  var builder = new WasmModuleBuilder();
  let funcRefT = builder.addType(kSig_i_ii);

  builder.addFunction("add", funcRefT)
    .addBody([kExprLocalGet, 0, kExprLocalGet, 1, kExprI32Add])
    .exportFunc();
  builder.addFunction("mul", funcRefT)
    .addBody([kExprLocalGet, 0, kExprLocalGet, 1, kExprI32Mul])
    .exportFunc();
  let mainSig =
    makeSig([kWasmI32, kWasmI32, wasmRefType(funcRefT)], [kWasmI32]);
  builder.addFunction("main", mainSig)
    .addLocals(kWasmI32, 1)
    .addBody([
      kExprLocalGet, 0,
      kExprLocalGet, 1,
      kExprLocalGet, 2,
      kExprCallRef, funcRefT,
  ]).exportFunc();

  let wasm = builder.instantiate().exports;
  // assertEquals(initialDeoptCount, %WasmDeoptsExecutedCount());
  print("Running until tier up");
  while (!%IsTurboFanFunction(wasm.main)) {
    // console.log("############");
    wasm.main(12, 30, wasm.add);
  }
  // wasm.main(12, 30, wasm.add);
  console.log("### After tier up ###");
  wasm.main(12, 30, wasm.add);
})();
