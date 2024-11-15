
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


(function TestArrayNewElem() {
    print(arguments.callee.name);
    let builder = new WasmModuleBuilder();
    let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
    let struct_type = wasmRefNullType(struct_type_index);
    let array_type_index = builder.addArray(struct_type, true);
  
    function makeStruct(element) {
      return [...wasmI32Const(element),
              kGCPrefix, kExprStructNew, struct_type_index];
    }
  
    let table = builder.addTable(kWasmAnyRef, 10, 10);
  
    let elems = [10, -10, 42, 55];
  
    let passive_segment = builder.addPassiveElementSegment(
      [makeStruct(elems[0]), makeStruct(elems[1]),
       [kExprRefNull, struct_type_index]],
      struct_type);
  
    let active_segment = builder.addActiveElementSegment(
        table, wasmI32Const(0), [makeStruct(elems[2]), makeStruct(elems[3])],
        struct_type);
  
    function generator(name, segment) {
      builder.addFunction(name, makeSig([kWasmI32, kWasmI32, kWasmI32], [kWasmI32]))
        .addBody([
          kExprLocalGet, 0,  // offset
          kExprLocalGet, 1,  // length
          kGCPrefix, kExprArrayNewElem, array_type_index, segment,
          kExprLocalGet, 2,  // index in the array
          kGCPrefix, kExprArrayGet, array_type_index,
          kGCPrefix, kExprStructGet, struct_type_index, 0])
        .exportFunc()
    }
  
    // Respective segment elements should be pointer-identical.
    builder.addFunction("identical", makeSig([kWasmI32, kWasmI32], [kWasmI32]))
      .addBody([
        kExprI32Const, 0,  // offset
        kExprLocalGet, 0,  // length
        kGCPrefix, kExprArrayNewElem, array_type_index, passive_segment,
        kExprLocalGet, 1,  // index in the array
        kGCPrefix, kExprArrayGet, array_type_index,
  
        kExprI32Const, 0,  // offset
        kExprLocalGet, 0,  // length
        kGCPrefix, kExprArrayNewElem, array_type_index, passive_segment,
        kExprLocalGet, 1,  // index in the array
        kGCPrefix, kExprArrayGet, array_type_index,
  
        kExprRefEq])
      .exportFunc()
  
    generator("init_and_get", passive_segment);
    generator("init_and_get_active", active_segment);
  
    builder.addFunction("drop", kSig_v_v)
      .addBody([kNumericPrefix, kExprElemDrop, passive_segment])
      .exportFunc();
  
    let instance = builder.instantiate();
  
    let init_and_get = instance.exports.init_and_get;
    let init_and_get_active = instance.exports.init_and_get_active;

    // Initializing from a passive segment works. The third element is null, so
    // we get a null dereference.
    // assertEquals(elems[0], init_and_get(0, 3, 0));
    // assertEquals(elems[1], init_and_get(0, 3, 1));
    assertTraps(kTrapNullDereference, () => init_and_get(0, 3, 2));
    // // The array has the correct length.
    // assertTraps(kTrapArrayOutOfBounds, () => init_and_get(0, 3, 3));
    // // Too large arrays are disallowed, in and out of Smi range.
    // assertTraps(kTrapArrayTooLarge, () => init_and_get(0, 1000000000, 10));
    // assertTraps(kTrapArrayTooLarge, () => init_and_get(0, 1 << 31, 10));
    // // Element is out of bounds.
    // assertTraps(kTrapElementSegmentOutOfBounds, () => init_and_get(0, 5, 0));
    // // Element index out of Smi range.
    // assertTraps(kTrapElementSegmentOutOfBounds,
    //             () => init_and_get(0x80000000, 0, 0));

    // Respective segment elements should be pointer-identical.
    // assertEquals(1, instance.exports.identical(3, 0));
    // Now drop the segment.
    instance.exports.drop();
    // // A 0-length array should still be created...
    // assertTraps(kTrapArrayOutOfBounds, () => init_and_get(0, 0, 0));
    // // ... but not a longer one.
    // assertTraps(kTrapElementSegmentOutOfBounds, () => init_and_get(0, 1, 0));
    // Same holds for an active segment.
    // assertTraps(kTrapArrayOutOfBounds, () => init_and_get_active(0, 0, 0));
    assertTraps(kTrapElementSegmentOutOfBounds,
                () => init_and_get_active(0, 1, 0));
  })();
  