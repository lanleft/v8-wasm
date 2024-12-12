
```bash
git checkout 8f419023eedcaa71f23675e08c094ec5bc585c5d
Previous HEAD position was ccb0882b91c [turboshaft] Collect more feedback in dataview.js test
HEAD is now at 8f419023eed [turboshaft] Fix typo in HAS_CPP_CLASS_TYPES_AS_TEMPLATE_ARGS


$gclient sync -D --force
cat out/debug/args.gn
is_debug = true
v8_enable_memory_corruption_api = true
dcheck_always_on = false
$autoninja -C out/debug d8

$./out/debug/d8 --experimental-wasm-imported-strings --no-liftoff  tc.js
# Type cast failed in CAST(reference.object) at ../../src/codegen/code-stub-assembler.h:1527
  Expected HeapObject but found Smi: 0x33 (51)

#
#
#
#FailureMessage Object: 0x7ffc61c3fc40
==== C stack trace ===============================

    /util/v8/v8/out/debug/libv8_libbase.so(v8::base::debug::StackTrace::StackTrace()+0x13) [0x7f0ff8e5e493]
    /util/v8/v8/out/debug/libv8_libplatform.so(+0x15ffd) [0x7f0ff8e0bffd]
    /util/v8/v8/out/debug/libv8_libbase.so(V8_Fatal(char const*, int, char const*, ...)+0x17d) [0x7f0ff8e3f8bd]
    /util/v8/v8/out/debug/libv8.so(v8::internal::CheckObjectType(unsigned long, unsigned long, unsigned long)+0x3a43) [0x7f0ff6f8b253]
    [0x7f0f7fdbd8d4]
Trace/breakpoint trap

```


tc.js
```js
e.execute('test/mjsunit/wasm/wasm-module-builder.js');

const builder = new WasmModuleBuilder();
builder.startRecGroup();
builder.addArray(kWasmI8, true, kNoSuperType, true);
builder.endRecGroup();
builder.startRecGroup();
builder.addArray(kWasmI16, true, kNoSuperType, true);
builder.endRecGroup();
builder.startRecGroup();
builder.addStruct([makeField(kWasmI16, false), makeField(kWasmF32, false), makeField(wasmRefType(kWasmI31Ref), false), makeField(kWasmI32, false)], kNoSuperType, false);
builder.addType(makeSig([kWasmI32, kWasmI32, kWasmI32], [kWasmI32])); // 3 main function sig
builder.endRecGroup();
builder.addType(makeSig([], [])); //4
builder.addType(makeSig([kWasmExternRef], [wasmRefType(kWasmExternRef)])); //5
builder.addType(makeSig([kWasmExternRef], [kWasmI32])); //6
builder.addType(makeSig([kWasmI32], [wasmRefType(kWasmExternRef)])); //7
builder.addType(makeSig([kWasmExternRef, kWasmI32], [kWasmI32])); //8
builder.addType(makeSig([], [])); //9
builder.addType(makeSig([], [])); //10
builder.addType(makeSig([], [])); //11
builder.addType(makeSig([], []));//12
builder.addType(makeSig([], [])); //13
builder.addType(makeSig([], [])); //14
builder.addType(makeSig([], [])); //15
builder.addImport('wasm:js-string', 'cast', 5 /* sig */); //0
builder.addImport('wasm:js-string', 'test', 6 /* sig */); //1
builder.addImport('wasm:js-string', 'fromCharCode', 7 /* sig */);//2
builder.addImport('wasm:js-string', 'fromCodePoint', 7 /* sig */);//3
builder.addImport('wasm:js-string', 'charCodeAt', 8 /* sig */);//4
builder.addImport('wasm:js-string', 'codePointAt', 8 /* sig */);//5
builder.addImport('wasm:js-string', 'length', 6 /* sig */);//6
builder.addMemory(7, 32);
builder.addTable(kWasmFuncRef, 1, 1, undefined);
builder.addActiveElementSegment(0, wasmI32Const(0), [[kExprRefFunc, 7, ]], kWasmFuncRef);
builder.addTag(makeSig([], []));
builder.addFunction(undefined, 3 /* sig */)
  .addBodyWithEnd([
kExprI32Const, 0xf9, 0x3f,  // i32.const
kExprLoop, 0x10,  // loop @4 i32
  kExprRefNull, 0x00,  // ref.null
  kExprRefAsNonNull,  // ref.as_non_null
  kExprI32Const,0x01,  // i32.const
  kGCPrefix, kExprArrayGetS, 0x00,  // array.get_s
  kExprI32Const, 0x01,  // i32.const
  kExprI32Const, 0x01,  // i32.const
  kSimdPrefix, kExprI8x16Splat,// i8x16.splat
  kExprI32Const, 0x0c,  // i32.const
  kSimdPrefix, kExprI64x2Shl, 0x01,  // i64x2.shl
  kSimdPrefix, kExprI16x8BitMask, 0x01,  // i16x8.bitmask
  kGCPrefix, kExprArrayNewDefault, 0x01,  // array.new_default
  kGCPrefix, kExprArrayLen,  // array.len
  kExprI32Const, 0x33, 0x01,  // i32.const
  kExprI32Add, // i32.add
  kGCPrefix, kExprRefI31,  // ref.i31
  kGCPrefix, kExprRefCastNull, 0x6c,  // ref.cast null
  kExprRefAsNonNull,  // ref.as_non_null
  kGCPrefix, kExprExternConvertAny,  // extern.convert_any
  kExprI32Const, 0x0,  // i32.const
  kExprCallFunction, 0x05,  // call function #5: codePointAt    [kWasmExternRef, kWasmI32], [kWasmI32]
  kExprDrop,
  kExprDrop,  // drop
  kExprI32Const, 0xf3, 0xea, 0x98, 0x8c, 0x78,  // i32.const
  kExprBrIf, 0x0,  // br_if depth=0
  kExprDrop,  // drop
  kExprEnd,  // end @236
kExprEnd,  // end @237
]);
builder.addExport('main', 7);
let kBuiltins = { builtins: ['js-string'] };
const instance = builder.instantiate({}, kBuiltins);
try {
  print(instance.exports.main(3, 3, 3));
} catch (e) {
  print('caught exception', e);
}
```
