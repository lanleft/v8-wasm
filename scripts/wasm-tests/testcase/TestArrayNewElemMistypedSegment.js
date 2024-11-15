
d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


(function TestArrayNewElemMistypedSegment() {
    print(arguments.callee.name);
    let builder = new WasmModuleBuilder();
    let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
    let struct_type = wasmRefNullType(struct_type_index);
    let array_type_index = builder.addArray(struct_type, true);
  
    let passive_segment = builder.addPassiveElementSegment([
      [kExprRefNull, array_type_index]],
      wasmRefNullType(array_type_index));
  
    builder.addFunction("mistyped", makeSig([kWasmI32, kWasmI32], [kWasmI32]))
        .addBody([
          kExprI32Const, 0,  // offset
          kExprLocalGet, 0,  // length
          kGCPrefix, kExprArrayNewElem, array_type_index,
          passive_segment,
          kExprLocalGet, 1,  // index in the array
          kGCPrefix, kExprArrayGet, array_type_index,
          kGCPrefix, kExprStructGet, struct_type_index, 0])
        .exportFunc()
  
    assertThrows(() => builder.instantiate(), WebAssembly.CompileError,
                 /segment type.*is not a subtype of array element type.*/);
  })();