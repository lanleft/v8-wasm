
// Flags: --experimental-wasm-shared --no-wasm-inlining

// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js shared-everything-basic.js  --experimental-wasm-shared --no-wasm-inlining

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// table 
(function FunctionTableInNonSharedFunction() {
    print(arguments.callee.name);
    let builder = new WasmModuleBuilder();
    let table = builder.addTable(
      wasmRefNullType(kWasmFuncRef, true), 10, undefined,
      [kExprRefNull, kWasmSharedTypeForm, kFuncRefCode], true);

    let sig = builder.addType(kSig_i_ii, kNoSuperType, true, true);

    let add = builder.addFunction("add", sig)
      .addBody([kExprLocalGet, 0, 
        kExprLocalGet, 1, 
        kExprI32Add]);

    let mul = builder.addFunction("mul", sig)
      .addBody([kExprLocalGet, 0, 
        kExprLocalGet, 1, 
        kExprI32Mul]);
        
    builder.addActiveElementSegment(
      table.index, [kExprI32Const, 0],
      [[kExprRefFunc, add.index], [kExprRefFunc, mul.index]],
      wasmRefNullType(kWasmFuncRef, true), true);

    let passive = builder.addPassiveElementSegment(
      [[kExprRefFunc, add.index], [kExprRefFunc, mul.index]],
      wasmRefNullType(kWasmFuncRef, true), true);
  
    builder.addFunction("call", kSig_i_iii)
      .addBody([
        kExprLocalGet, 0, 
        kExprLocalGet, 1, 
        kExprLocalGet, 2,
        kExprCallIndirect, sig, table.index])
      .exportFunc();
  
    builder.addFunction("call_through_get", kSig_i_iii)
      .addBody([
        kExprLocalGet, 0, kExprLocalGet, 1,
        kExprLocalGet, 2, kExprTableGet, table.index,
        kGCPrefix, kExprRefCast, sig,
        kExprCallRef, sig])
      .exportFunc()
  
    builder.addFunction("set", kSig_v_v)
      .addBody([
        kExprI32Const, 0, kExprRefFunc, mul.index, kExprTableSet, table.index])
      .exportFunc();
  
    builder.addFunction("grow", kSig_v_v)
      .addBody([kExprRefNull, kWasmSharedTypeForm, kFuncRefCode,
                kExprI32Const, 42, 
                kNumericPrefix, kExprTableGrow, table.index,
                kExprDrop])
      .exportFunc();
  
    builder.addFunction("fill", kSig_v_v)
      .addBody([kExprI32Const, 10, kExprRefFunc, add.index, kExprI32Const, 42,
                kNumericPrefix, kExprTableFill, table.index])
      .exportFunc();
  
    builder.addFunction("init", kSig_v_v)
      .addBody([kExprI32Const, 20, 
                kExprI32Const, 0, 
                kExprI32Const, 2,
                kNumericPrefix, kExprTableInit, passive, table.index])
      .exportFunc();
  
    builder.addFunction("copy", kSig_v_v)
      .addBody([kExprI32Const, 30, kExprI32Const, 20, kExprI32Const, 2,
                kNumericPrefix, kExprTableCopy, table.index, table.index])
      .exportFunc();
  
    builder.addFunction("size", kSig_i_v)
      .addBody([kNumericPrefix, kExprTableSize, table.index])
      .exportFunc();
  
    let wasm = builder.instantiate().exports;
  
    assertEquals(30, wasm.call(10, 20, 0));
    assertEquals(200, wasm.call(10, 20, 1));
    assertEquals(30, wasm.call_through_get(10, 20, 0));
    assertEquals(200, wasm.call_through_get(10, 20, 1));
    wasm.set();
    assertEquals(200, wasm.call(10, 20, 0));
    wasm.grow();
    assertTraps(kTrapFuncSigMismatch, () => wasm.call(10, 20, 42));
    wasm.fill();
    assertEquals(30, wasm.call(10, 20, 42));
    wasm.init();
    assertEquals(200, wasm.call(10, 20, 21));
    wasm.copy();
    assertEquals(30, wasm.call(10, 20, 30));
    assertEquals(200, wasm.call(10, 20, 31));
    assertEquals(52, wasm.size());
  })();



// elemt segment

// (function SharedArrayNewAndInitInNonSharedFunction() {
//     print(arguments.callee.name);
  
//     let builder = new WasmModuleBuilder();
  
//     let struct_type = builder.addStruct(
//       [makeField(kWasmI32, true)], kNoSuperType, true, true);
  
//     let array_type =
//       builder.addArray(wasmRefType(struct_type), true, kNoSuperType, true,
//                        true);
  
//     let segment = builder.addPassiveElementSegment(
//       [[kExprI32Const, 0, kGCPrefix, kExprStructNew, struct_type],
//        [kExprI32Const, 1, kGCPrefix, kExprStructNew, struct_type],
//        [kExprI32Const, 2, kGCPrefix, kExprStructNew, struct_type],
//        [kExprI32Const, 3, kGCPrefix, kExprStructNew, struct_type]],
//       wasmRefType(struct_type), true);
  
//     builder.addFunction("new_segment", makeSig([], [wasmRefType(array_type)]))
//       .addBody([kExprI32Const, 0, // offset
//                 kExprI32Const, 4, // length
//                 kGCPrefix, kExprArrayNewElem, array_type, segment])
//       .exportFunc();
  
//     builder.addFunction("get", makeSig([wasmRefNullType(array_type), kWasmI32],
//                                        [kWasmI32]))
//       .addBody([kExprLocalGet, 0, kExprLocalGet, 1,
//                 kGCPrefix, kExprArrayGet, array_type,
//                 kGCPrefix, kExprStructGet, struct_type, 0])
//       .exportFunc();
  
//     builder.addFunction("init_segment",
//                         makeSig([wasmRefNullType(array_type)], []))
//       .addBody([kExprLocalGet, 0, // array
//                 kExprI32Const, 2, // array_index
//                 kExprI32Const, 0,   // segment_offset
//                 kExprI32Const, 2,  // length
//                 kGCPrefix, kExprArrayInitElem, array_type, segment])
//       .exportFunc();
  
//     let wasm = builder.instantiate().exports;
  
//     let array = wasm.new_segment();
  
//     // assertEquals(0, wasm.get(array, 0));
//     // assertEquals(1, wasm.get(array, 1));
    
//     // assertEquals(2, wasm.get(array, 2));
//     // assertEquals(3, wasm.get(array, 3));
  
//     wasm.init_segment(array);
  
//     assertEquals(1, wasm.get(array, 1));
//     // assertEquals(0, wasm.get(array, 0));
//     // assertEquals(0, wasm.get(array, 2));
//     // assertEquals(1, wasm.get(array, 3));
//   })();
  