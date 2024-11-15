

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


// TODO(14034): Reenable when we have constant array.new_elem.

// Element segments are defined after globals, so currently it is not valid
// to refer to an element segment in the global section.
(function TestArrayNewFixedFromElemInGlobal() {
  print(arguments.callee.name);
  let builder = new WasmModuleBuilder();
  let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
  let struct_type = wasmRefNullType(struct_type_index);
  let array_type_index = builder.addArray(struct_type, true);

  let passive_segment = builder.addPassiveElementSegment([
    [kExprRefNull, struct_type_index]],
    struct_type_index);

  builder.addGlobal(
    wasmRefNullType(array_type_index), false, false,
    [...wasmI32Const(0), ...wasmI32Const(1),
     kGCPrefix, kExprArrayNewElem,
     array_type_index, passive_segment]);

     builder.instantiate();
//   assertThrows(() => builder.instantiate(), WebAssembly.CompileError,
//                /invalid element segment index/);
})();

// (function TestArrayNewElemConstantArrayTooLarge() {
//   print(arguments.callee.name);
//   let builder = new WasmModuleBuilder();
//   let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
//   let struct_type = wasmRefNullType(struct_type_index);
//   let array_type_index = builder.addArray(struct_type, true);
//   let array_type = wasmRefNullType(array_type_index);

//   function makeStruct(element) {
//     return [...wasmI32Const(element),
//             kGCPrefix, kExprStructNew, struct_type_index];
//   }

//   builder.addTable(kWasmAnyRef, 10, 10);
//   let table = 0;

//   let elems = [10, -10];

//   let passive_segment = builder.addPassiveElementSegment(
//     [makeStruct(elems[0]), makeStruct(elems[1]),
//      [kExprRefNull, struct_type_index]],
//     struct_type);

//   let array_segment = builder.addPassiveElementSegment(
//     [[...wasmI32Const(0), ...wasmI32Const(1 << 30),
//       kGCPrefix, kExprArrayNewElem,
//       array_type_index, passive_segment]],
//     array_type
//   );

//   builder.addFunction("init", kSig_v_v)
//     .addBody([kExprI32Const, 0, kExprI32Const, 0, kExprI32Const, 1,
//               kNumericPrefix, kExprTableInit, array_segment, table])
//     .exportFunc();

//   let instance = builder.instantiate();
//   assertTraps(kTrapArrayTooLarge, () => instance.exports.init());
// })();

// (function TestArrayNewElemConstantElementSegmentOutOfBounds() {
//   print(arguments.callee.name);
//   let builder = new WasmModuleBuilder();
//   let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
//   let struct_type = wasmRefNullType(struct_type_index);
//   let array_type_index = builder.addArray(struct_type, true);
//   let array_type = wasmRefNullType(array_type_index);

//   function makeStruct(element) {
//     return [...wasmI32Const(element),
//             kGCPrefix, kExprStructNew, struct_type_index];
//   }

//   builder.addTable(kWasmAnyRef, 10, 10);
//   let table = 0;

//   let elems = [10, -10];

//   let passive_segment = builder.addPassiveElementSegment(
//     [makeStruct(elems[0]), makeStruct(elems[1]),
//      [kExprRefNull, struct_type_index]],
//     struct_type);

//   let array_segment = builder.addPassiveElementSegment(
//     [[...wasmI32Const(0), ...wasmI32Const(10),
//       kGCPrefix, kExprArrayNewElem,
//       array_type_index, passive_segment]],
//     array_type
//   );

//   builder.addFunction("init", kSig_v_v)
//     .addBody([kExprI32Const, 0, kExprI32Const, 0, kExprI32Const, 1,
//               kNumericPrefix, kExprTableInit, array_segment, table])
//     .exportFunc();

//   let instance = builder.instantiate();
//   assertTraps(kTrapElementSegmentOutOfBounds, () => instance.exports.init());
// })();

// (function TestArrayNewElemConstantActiveSegment() {
//   print(arguments.callee.name);
//   let builder = new WasmModuleBuilder();
//   let struct_type_index = builder.addStruct([makeField(kWasmI32, false)]);
//   let struct_type = wasmRefNullType(struct_type_index);
//   let array_type_index = builder.addArray(struct_type, true);
//   let array_type = wasmRefNullType(array_type_index);

//   function makeStruct(element) {
//     return [...wasmI32Const(element),
//             kGCPrefix, kExprStructNew, struct_type_index];
//   }

//   builder.addTable(kWasmAnyRef, 10, 10);
//   let table = 0;

//   let elems = [10, -10];

//   let active_segment = builder.addActiveElementSegment(
//     table, wasmI32Const(0),
//     [makeStruct(elems[0]), makeStruct(elems[1]),
//      [kExprRefNull, struct_type_index]],
//     struct_type);

//   let array_segment = builder.addPassiveElementSegment(
//     [[...wasmI32Const(0), ...wasmI32Const(3),
//       kGCPrefix, kExprArrayNewElem,
//       array_type_index, active_segment]],
//     array_type
//   );

//   builder.addFunction("init", kSig_v_v)
//     .addBody([kExprI32Const, 0, kExprI32Const, 0, kExprI32Const, 1,
//               kNumericPrefix, kExprTableInit, array_segment, table])
//     .exportFunc();

//   let instance = builder.instantiate();
//   // An active segment counts as having 0 length.
//   assertTraps(kTrapElementSegmentOutOfBounds, () => instance.exports.init());
// })();
