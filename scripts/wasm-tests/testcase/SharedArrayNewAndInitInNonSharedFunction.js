
// Flags: --experimental-wasm-shared --no-wasm-inlining

// /home/vult/Desktop/v8-wasm/v8/out/release/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js test1.js  --experimental-wasm-shared --no-wasm-inlining

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

(function SharedArrayNewAndInitInNonSharedFunction() {
    print(arguments.callee.name);
  
    let builder = new WasmModuleBuilder();
  
    let struct_type = builder.addStruct(
      [makeField(kWasmI32, true)], kNoSuperType, true, true);
  
    let array_type =
      builder.addArray(wasmRefType(struct_type), true, kNoSuperType, true,
                       true);
  
    let segment = builder.addPassiveElementSegment(
      [[kExprI32Const, 0, kGCPrefix, kExprStructNew, struct_type],
       [kExprI32Const, 1, kGCPrefix, kExprStructNew, struct_type],
       [kExprI32Const, 2, kGCPrefix, kExprStructNew, struct_type],
       [kExprI32Const, 3, kGCPrefix, kExprStructNew, struct_type]],
      wasmRefType(struct_type), true);
  
    builder.addFunction("new_segment", makeSig([], [wasmRefType(array_type)]))
      .addBody([kExprI32Const, 0, // offset
                kExprI32Const, 4, // length
                kGCPrefix, kExprArrayNewElem, array_type, segment])
      .exportFunc();
  
    builder.addFunction("get", makeSig([wasmRefNullType(array_type), kWasmI32],
                                       [kWasmI32]))
      .addBody([kExprLocalGet, 0, kExprLocalGet, 1,
                kGCPrefix, kExprArrayGet, array_type,
                kGCPrefix, kExprStructGet, struct_type, 0])
      .exportFunc();
  
    builder.addFunction("init_segment",
                        makeSig([wasmRefNullType(array_type)], []))
      .addBody([kExprLocalGet, 0, // array
                kExprI32Const, 2, // array_index
                kExprI32Const, 0,   // segment_offset
                kExprI32Const, 2,  // length
                kGCPrefix, kExprArrayInitElem, array_type, segment])
      .exportFunc();
  
    let wasm = builder.instantiate().exports;
  
    let array = wasm.new_segment();
  
    // assertEquals(0, wasm.get(array, 0));
    // assertEquals(1, wasm.get(array, 1));
    
    // assertEquals(2, wasm.get(array, 2));
    // assertEquals(3, wasm.get(array, 3));
  
    wasm.init_segment(array);
  
    assertEquals(1, wasm.get(array, 1));
    // assertEquals(0, wasm.get(array, 0));
    // assertEquals(0, wasm.get(array, 2));
    // assertEquals(1, wasm.get(array, 3));
  })();
  