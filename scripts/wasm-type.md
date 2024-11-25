# Wasm Type

## TOC


## Use wasm_null for exnref


Commit: https://chromium-review.googlesource.com/c/v8/v8/+/5953226

```
[wasm][exnref] Use wasm_null for exnref

A JS null caught in wasm as an exnref with catch_(all_)ref should be
observably different from a null exnref: a JS null should behave like a
regular JS exception with null as the externref package, while a null
exnref is the actual null value for this type. In particular, a JS
null exception can be rethrown while a null exnref cannot.
Represent null exnrefs with wasm_null instead of JS null to avoid the
confusion.
```

This commit message explains a change in the handling of `exnref` (exception reference) values in WebAssembly (Wasm). The goal is to distinguish between two different types of "null" values in the context of Wasm and JavaScript. 

### Context

- `exnref`: A Wasm type used to represent exception references
- JS null: the null value in JavaScript, which can be caught and manipulated in various ways.
- `wasm_null`: A dedicated representation of a null value specific to Wasm, distinct from JavaScript's `null`

### Problem

When Wasm code interacts with JS:
1. JS null in Wasm:
    - If a JS `null` is caught in Wasm as an `exnref` (e.g., using catch_ref or catch_all_ref), it should behave as a JS exception.
    - This means it can be rethrown as a regular JS exception with `null` encapsulated as the `externref` value: https://source.chromium.org/chromium/chromium/src/+/main:v8/src/runtime/runtime-wasm.cc;drc=bc461b56c036169f465a5a04c0daff8ea32d4f80;l=398

2. Wasm null `exnref`:
    - A null value of type `exnref` in Wasm represents a true null for this type
    - Unlike a JS exception, it **cannot be rethrown** because it is not a valid exception object

### Confusion

Using a JS `null` to represent both types of null (JS null and Wasm null `exnref`) leads to ambiguity:
    - A JS `null` might be incorrectly interpreted as a Wasm `null exnref`, or vice versa.
    - This could result in unexpected behaviours, especially when distinguishing between rethrowable exceptions and actualll nulls in Wasm

**Discusses**

- tức là muốn fix cái này thì hoặc là patch chỗ CATCH, hoặc chỗ THROW để phân biệt ra 2 loại?
  - e nghĩ chỗ throw là đủ r ạ, tại sao mình phải patch cả catch ạ?

**a nghĩ tiếp theo vẫn phải hiểu logic của catch -> rethrow 1 cái wasm_null sẽ gây ra effect gì ? tại sao rethrow ko dc?**

**Extended ideas**
- https://source.chromium.org/chromium/chromium/src/+/main:v8/src/builtins/wasm.tq;l=455;drc=32eafd697e3451d54943f089607fd6a3c2bd9066


**Module Instantiate**

- https://chromium.googlesource.com/v8/v8.git/+/7e6d85b27b1633a918373b1ea533b516e0169a86/src/wasm/module-instantiate.cc#414


## Exception handling Spec

Reading Exception Handling spec: https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md

#### Throwing an exception

- In case of `catch` or `catch_ref`, **the arguments** of the exception are pushed back onto the stack. For `catch_ref` and `catch_all_ref`, an **exception reference** is then pushed to the stack, which represents the caught exception.

#### ReThrowing an exception

- The `throw_ref` takes an operand of type `exnref` and re-throws the corresponding caught exception. If the operand is null, a trap occurs.
- To preserve stack trace info when crossing the JS to Wasm boundary, exceptions can internally containi a stack trace, which is propagated when caught by a `catch[_all]_ref` clause and rethrown by `throw_ref`. 

#### Changes to the binary model

- The type `exnref` is represented by the type opcode `-0x17`
- When combined with the GC proposal, there also is a value type `nullexnref` with opcode `-0x0c`. Furthermore, these opcodes also function as heap type, i.e., `exn` is a new heap type with opcode `-0x17`, and `noexn` is a new heap type with opcode `-0x0c`; `exnref` and `nullexnref` are shorthands for `ref null exn` and `(ref null noexn)`, respectively.

- The heap type `noexn` is a subtype of `exn`. They are not in a subtype relation with any other type (exception bottom), such that they form a new disjoint hierarchy of heap types.
 
![image1](images/control-flow-instructions.png)



## Examples

**Example1**

WebAssembly.Exception

Tell what did they do?? which one be affected??
This example throughs `WASM_EXCEPTION_PACKAGE_TYPE`. 

```js

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let tag_index = builder.addTag(makeSig([], []));
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));
  builder.addFunction('get_exnref', makeSig([], [kWasmExnRef]))
    .addLocals(kWasmNullExnRef, 1)
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprThrow, tag_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();

  function throw_js(r) {
    console.log("================ throw_js object =================");
    %DebugPrint(r);
    //   r = null;
     throw r; }
  let instance = builder.instantiate({m: {import: throw_js}});
  return instance;
})();

let builder = new WasmModuleBuilder();
let get_exnref = builder.addImport('m', 'get_exnref', makeSig([], [kWasmExnRef]));

builder.addFunction('main',
    makeSig([], []))
.addBody([
    kExprCallFunction, get_exnref,
    kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprThrowRef])
.exportFunc();


// let obj = {};
// console.log("===================== begining obj==================");
// %DebugPrint(obj);
let instance = builder.instantiate({m: {get_exnref: helper.exports.get_exnref}});
let wasm = instance.exports;

try {
    wasm.main();
} catch (e) {
    console.log("===================== catch obj==================");
    console.log(e);
}

```

Output:
```c
❯ /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output/test3.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax

===== graph-builder-interface.cc ThrowRef =====
#33:Call
====================================
====wasm-compiler rethrow====
==== builtin WasmRethrow ====

exception: : DebugPrint: 0x2ff002b70f9: [WasmExceptionPackage]
 - map: 0x02ff0008fd05 <Map[20](HOLEY_ELEMENTS)>
0x2ff0008fd05: [Map] in OldSpace
 - map: 0x02ff00081a35 <MetaMap (0x02ff00081a85 <NativeContext[301]>)>
 - type: WASM_EXCEPTION_PACKAGE_TYPE
 - instance size: 20
 - inobject properties: 2
 - unused property fields: 0
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x02ff00000069 <undefined>
 - prototype_validity cell: 0x02ff00000ab1 <Cell value= 1>
 - instance descriptors (own) #2: 0x02ff0008fde9 <DescriptorArray[2]>
 - prototype: 0x02ff0008fd95 <Object map = 0x2ff0008fd2d>
 - constructor: 0x02ff0008fce5 <JSFunction Exception (sfi = 0x2ff000482d9)>
 - dependent code: 0x02ff00000785 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

===Runtime_WasmReThrow====
===================== catch obj==================
[object WebAssembly.Exception]
```


**Example2**

```js

// Flags: --no-liftoff
// scripts/output/regress-1484393.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// Helper module to produce an exnref or convert a JS value to an exnref.
let helper = (function () {
  let builder = new WasmModuleBuilder();
  let throw_index = builder.addImport('m', 'import', makeSig([kWasmExternRef], []));

  builder.addFunction('to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]))
      .addBody([
          kExprTryTable, kWasmVoid, 1,
          kCatchAllRef, 0,
          kExprLocalGet, 0,
          kExprCallFunction, throw_index,
          kExprEnd,
          kExprUnreachable,
      ]).exportFunc();

  function throw_js(r) {
    console.log("================ throw_js object =================");
    %DebugPrint(r);
    // r = kWasmNullExternRef;
     throw r; }
  let instance = builder.instantiate({m: {import: throw_js}});
  return instance;
})();


let builder = new WasmModuleBuilder();
let to_exnref = builder.addImport('m', 'to_exnref', makeSig([kWasmExternRef], [kWasmExnRef]));


builder.addMemory(1, 10);

builder.addFunction('main',
  makeSig([kWasmExternRef], []))
.addBody([
    kExprLocalGet, 0,
    kExprCallFunction, to_exnref,
    kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprThrowRef])
.exportFunc();


let instance = builder.instantiate({m: {to_exnref: helper.exports.to_exnref}});

let obj = {};
%DebugPrint(obj);
console.log("==================begining object =====================");

try {
  instance.exports.main(obj);
} catch (e) {
    console.log("==================catch object =====================");
    console.log(e);
    // %DebugPrint(e);
}

```

Output:

```c
❯ /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output/test4.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax

DebugPrint: 0x3395002b71c1: [JS_OBJECT_TYPE]
 - map: 0x3395000827b9 <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - elements: 0x339500000775 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x339500000775 <FixedArray[0]>
 - All own properties (excluding elements): {}
0x3395000827b9: [Map] in OldSpace
 - map: 0x339500081a35 <MetaMap (0x339500081a85 <NativeContext[301]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 28
 - inobject properties: 4
 - unused property fields: 4
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - back pointer: 0x339500000069 <undefined>
 - prototype_validity cell: 0x339500000ab1 <Cell value= 1>
 - instance descriptors (own) #0: 0x3395000007a9 <DescriptorArray[0]>
 - transitions #3: 0x3395000b2431 <TransitionArray[11]>
   Transitions #3:
     0x3395000a2d39: [String] in OldSpace: #module: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b04cd <Map[28](HOLEY_ELEMENTS)>
     0x33950024e3ad: [String] in ReadOnlySpace: #min: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b2409 <Map[28](HOLEY_ELEMENTS)>
     0x33950009ea89: [String] in OldSpace: #GC: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000af5d1 <Map[28](HOLEY_ELEMENTS)>
   Prototype transitions #2: 0x3395000827f5 <WeakFixedArray[3]>
     0x339500000085 <null> -> 0x3395000b211d <Map[28](HOLEY_ELEMENTS)>
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - constructor: 0x3395000824ad <JSFunction Object (sfi = 0x339500254879)>
 - dependent code: 0x339500000785 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

==================begining object =====================
===== graph-builder-interface.cc ThrowRef =====
#37:Call
====================================
====wasm-compiler rethrow====
================ throw_js object =================
DebugPrint: 0x3395002b71c1: [JS_OBJECT_TYPE]
 - map: 0x3395000827b9 <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - elements: 0x339500000775 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x339500000775 <FixedArray[0]>
 - All own properties (excluding elements): {}
0x3395000827b9: [Map] in OldSpace
 - map: 0x339500081a35 <MetaMap (0x339500081a85 <NativeContext[301]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 28
 - inobject properties: 4
 - unused property fields: 4
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - back pointer: 0x339500000069 <undefined>
 - prototype_validity cell: 0x339500000ab1 <Cell value= 1>
 - instance descriptors (own) #0: 0x3395000007a9 <DescriptorArray[0]>
 - transitions #3: 0x3395000b2431 <TransitionArray[11]>
   Transitions #3:
     0x3395000a2d39: [String] in OldSpace: #module: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b04cd <Map[28](HOLEY_ELEMENTS)>
     0x33950024e3ad: [String] in ReadOnlySpace: #min: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b2409 <Map[28](HOLEY_ELEMENTS)>
     0x33950009ea89: [String] in OldSpace: #GC: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000af5d1 <Map[28](HOLEY_ELEMENTS)>
   Prototype transitions #2: 0x3395000827f5 <WeakFixedArray[3]>
     0x339500000085 <null> -> 0x3395000b211d <Map[28](HOLEY_ELEMENTS)>
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - constructor: 0x3395000824ad <JSFunction Object (sfi = 0x339500254879)>
 - dependent code: 0x339500000785 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

==== builtin WasmRethrow ====

exception: : DebugPrint: 0x3395002b71c1: [JS_OBJECT_TYPE]
 - map: 0x3395000827b9 <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - elements: 0x339500000775 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x339500000775 <FixedArray[0]>
 - All own properties (excluding elements): {}
0x3395000827b9: [Map] in OldSpace
 - map: 0x339500081a35 <MetaMap (0x339500081a85 <NativeContext[301]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 28
 - inobject properties: 4
 - unused property fields: 4
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - back pointer: 0x339500000069 <undefined>
 - prototype_validity cell: 0x339500000ab1 <Cell value= 1>
 - instance descriptors (own) #0: 0x3395000007a9 <DescriptorArray[0]>
 - transitions #3: 0x3395000b2431 <TransitionArray[11]>
   Transitions #3:
     0x3395000a2d39: [String] in OldSpace: #module: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b04cd <Map[28](HOLEY_ELEMENTS)>
     0x33950024e3ad: [String] in ReadOnlySpace: #min: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000b2409 <Map[28](HOLEY_ELEMENTS)>
     0x33950009ea89: [String] in OldSpace: #GC: (transition to (const data field, attrs: [WEC]) @ Any) -> 0x3395000af5d1 <Map[28](HOLEY_ELEMENTS)>
   Prototype transitions #2: 0x3395000827f5 <WeakFixedArray[3]>
     0x339500000085 <null> -> 0x3395000b211d <Map[28](HOLEY_ELEMENTS)>
 - prototype: 0x33950008298d <Object map = 0x339500081f99>
 - constructor: 0x3395000824ad <JSFunction Object (sfi = 0x339500254879)>
 - dependent code: 0x339500000785 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

===Runtime_WasmReThrow====
==================catch object =====================
[object Object]
```


## Wasm wrappers examples
**


**Tiring up**

```c++
Test cases containing the js2js marker:
/home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output3/regress-336214779.js --jit-fuzzing --allow-natives-syntax --experimental-wasm-exnref
/home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output3/regress-346597059.js --allow-natives-syntax --wasm-wrapper-tiering-budget=1
/home/vult/Desktop/v8-wasm/v8/out/debug/d8 --test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/output3/regress-324596281.js --wasm-wrapper-tiering-budget=1
```

Wrappers ToJS stack trace:

```c++

pwndbg> bt
#0  v8::internal::wasm::WasmWrapperTSGraphBuilder::ToJS (this=this@entry=0x7fffffffb8d0, ret=ret@entry=..., type=..., context=...) at ../../src/wasm/wrappers.cc:196
#1  0x00007ffff6bbe549 in v8::internal::wasm::WasmWrapperTSGraphBuilder::AddArgumentNodes (this=this@entry=0x7fffffffb8d0, args=..., pos=<optimized out>, pos@entry=3, wasm_params=..., sig=0x5555555fb918, context=...) at ../../src/wasm/wrappers.cc:1101
#2  0x00007ffff6bb5052 in v8::internal::wasm::WasmWrapperTSGraphBuilder::BuildWasmToJSWrapper (this=this@entry=0x7fffffffb8d0, kind=v8::internal::wasm::ImportCallKind::kUseCallBuiltin, expected_arity=1, suspend=suspend@entry=v8::internal::wasm::kNoSuspend) at ../../src/wasm/wrappers.cc:564
#3  0x00007ffff6bb3a64 in v8::internal::wasm::BuildWasmWrapper (data=data@entry=0x7fffffffbe98, allocator=allocator@entry=0x7fffffffc230, graph=..., sig=sig@entry=0x5555555fb918, wrapper_info=...) at ../../src/wasm/wrappers.cc:1331
#4  0x00007ffff71c4c0f in v8::internal::compiler::Pipeline::GenerateCodeForWasmNativeStubFromTurboshaft (module=0x55555567a048, sig=0x5555555fb918, wrapper_info=..., debug_name=<optimized out>, options=..., source_positions=0x0) at ../../src/compiler/pipeline.cc:3176
#5  0x00007ffff7ca3b32 in v8::internal::compiler::CompileWasmImportCallWrapper(v8::internal::wasm::CompilationEnv*, v8::internal::wasm::ImportCallKind, v8::internal::Signature<v8::internal::wasm::CanonicalValueType> const*, bool, int, v8::internal::wasm::Suspend)::$_0::operator()() const (this=<optimized out>) at ../../src/compiler/wasm-compiler.cc:8701
#6  v8::internal::compiler::CompileWasmImportCallWrapper (env=env@entry=0x7fffffffc728, kind=kind@entry=v8::internal::wasm::ImportCallKind::kUseCallBuiltin, sig=sig@entry=0x5555555fb918, source_positions=<optimized out>, expected_arity=expected_arity@entry=1, suspend=v8::internal::wasm::kNoSuspend) at ../../src/compiler/wasm-compiler.cc:8740
#7  0x00007ffff6b43d7c in v8::internal::wasm::WasmImportWrapperCache::CompileWasmImportCallWrapper (this=0x5555555fb868, isolate=0x555555600000, native_module=0x55555568bfb0, kind=v8::internal::wasm::ImportCallKind::kUseCallBuiltin, sig=0x5555555fb918, sig_index=..., source_positions=<optimized out>, expected_arity=1, suspend=v8::internal::wasm::kNoSuspend) at ../../src/wasm/wasm-import-wrapper-cache.cc:144
#8  0x00007ffff69fa201 in v8::internal::wasm::InstanceBuilder::ProcessImportedFunction (this=this@entry=0x7fffffffcd68, trusted_instance_data=trusted_instance_data@entry=..., import_index=import_index@entry=0, func_index=<optimized out>, value=..., preknown_import=<optimized out>) at ../../src/wasm/module-instantiate.cc:2020
#9  0x00007ffff69f2399 in v8::internal::wasm::InstanceBuilder::ProcessImports (this=this@entry=0x7fffffffcd68, trusted_instance_data=trusted_instance_data@entry=..., shared_trusted_instance_data=shared_trusted_instance_data@entry=...) at ../../src/wasm/module-instantiate.cc:2392
#10 0x00007ffff69edebf in v8::internal::wasm::InstanceBuilder::Build (this=this@entry=0x7fffffffcd68) at ../../src/wasm/module-instantiate.cc:1325
#11 0x00007ffff69eccbd in v8::internal::wasm::InstantiateToInstanceObject (isolate=isolate@entry=0x555555600000, thrower=thrower@entry=0x7fffffffcfc0, module_object=module_object@entry=..., imports=imports@entry=..., memory_buffer=memory_buffer@entry=...) at ../../src/wasm/module-instantiate.cc:1042
#12 0x00007ffff6b26385 in v8::internal::wasm::WasmEngine::SyncInstantiate (this=<optimized out>, isolate=0x555555600000, thrower=0x7fffffffcfc0, module_object=..., imports=..., memory=...) at ../../src/wasm/wasm-engine.cc:736
#13 0x00007ffff6b4adcf in v8::(anonymous namespace)::WebAssemblyInstanceImpl (info=...) at ../../src/wasm/wasm-js.cc:1063
#14 v8::internal::wasm::WebAssemblyInstance (info=...) at ../../src/wasm/wasm-js.cc:3053
#15 0x00007ffff529de95 in v8::internal::FunctionCallbackArguments::CallOrConstruct (this=this@entry=0x7fffffffd110, function=..., is_construct=true) at ../../src/api/api-arguments-inl.h:95
#16 0x00007ffff529c7b6 in v8::internal::(anonymous namespace)::HandleApiCallHelper<true> (isolate=isolate@entry=0x555555600000, new_target=new_target@entry=..., fun_data=fun_data@entry=..., receiver=receiver@entry=..., argv=argv@entry=0x7fffffffd2c8, argc=argc@entry=2) at ../../src/builtins/builtins-api.cc:108
#17 0x00007ffff529afe0 in v8::internal::Builtin_Impl_HandleApiConstruct (args=..., isolate=isolate@entry=0x555555600000) at ../../src/builtins/builtins-api.cc:139
#18 0x00007ffff529ab6d in v8::internal::Builtin_HandleApiConstruct (args_length=7, args_object=0x7fffffffd2d0, isolate=0x555555600000) at ../../src/builtins/builtins-api.cc:130
#19 0x00007fff7f8309fd in ?? ()
#20 0x00007fffffffd280 in ?? ()

```

**Crashes**



stacktrace:

```c++
pwndbg> bt
#0  v8::internal::wasm::TurboshaftGraphBuildingInterface::ThrowRef (this=this@entry=0x7fffffffbb18, decoder=decoder@entry=0x7fffffffba80, exn=exn@entry=...) at ../../src/wasm/turboshaft-graph-interface.cc:7823
#1  0x00007ffff6a4cc6b in v8::internal::wasm::TurboshaftGraphBuildingInterface::ThrowRef (this=0x7ffff248f7e0 <_IO_stdfile_1_lock>, this@entry=0x23a, decoder=0x7fffffffba80, value=<optimized out>) at ../../src/wasm/turboshaft-graph-interface.cc:3898
#2  v8::internal::wasm::WasmFullDecoder<v8::internal::wasm::Decoder::NoValidationTag, v8::internal::wasm::TurboshaftGraphBuildingInterface, (v8::internal::wasm::DecodingMode)0>::DecodeThrowRefImpl (this=this@entry=0x7fffffffba80, trace_msg=trace_msg@entry=0x7fffffffb570, opcode=opcode@entry=v8::internal::wasm::kExprThrowRef) at ../../src/wasm/function-body-decoder-impl.h:3329
#3  0x00007ffff6a309bb in v8::internal::wasm::WasmFullDecoder<v8::internal::wasm::Decoder::NoValidationTag, v8::internal::wasm::TurboshaftGraphBuildingInterface, (v8::internal::wasm::DecodingMode)0>::DecodeThrowRef (decoder=0x7fffffffba80, opcode=v8::internal::wasm::kExprThrowRef) at ../../src/wasm/function-body-decoder-impl.h:3326
#4  0x00007ffff6a27a13 in v8::internal::wasm::WasmFullDecoder<v8::internal::wasm::Decoder::NoValidationTag, v8::internal::wasm::TurboshaftGraphBuildingInterface, (v8::internal::wasm::DecodingMode)0>::DecodeFunctionBody (this=this@entry=0x7fffffffba80) at ../../src/wasm/function-body-decoder-impl.h:2863
#5  0x00007ffff6a18433 in v8::internal::wasm::WasmFullDecoder<v8::internal::wasm::Decoder::NoValidationTag, v8::internal::wasm::TurboshaftGraphBuildingInterface, (v8::internal::wasm::DecodingMode)0>::Decode (this=this@entry=0x7fffffffba80) at ../../src/wasm/function-body-decoder-impl.h:2686
#6  0x00007ffff6a17ed6 in v8::internal::wasm::BuildTSGraph (data=data@entry=0x7fffffffc268, allocator=allocator@entry=0x7fffffffc670, env=0x7fffffffcfb0, detected=detected@entry=0x7fffffffd02c, graph=..., func_body=..., wire_bytes=0x555555676b58, assumptions=0x555555676e20, inlining_positions=0x7fffffffc6d0, func_index=2) at ../../src/wasm/turboshaft-graph-interface.cc:8464
#7  0x00007ffff71c95b1 in v8::internal::compiler::Pipeline::GenerateWasmCodeFromTurboshaftGraph (info=0x7fffffffc980, env=0x7fffffffcfb0, compilation_data=..., mcgraph=0x555555677018, detected=0x7fffffffd02c, call_descriptor=0x555555677358) at ../../src/compiler/pipeline.cc:3562
#8  0x00007ffff7c7cf77 in v8::internal::compiler::turboshaft::ExecuteTurboshaftWasmCompilation (env=env@entry=0x7fffffffcfb0, data=..., detected=detected@entry=0x7fffffffd02c) at ../../src/compiler/turboshaft/wasm-turboshaft-compiler.cc:53
#9  0x00007ffff696f6d3 in v8::internal::wasm::WasmCompilationUnit::ExecuteFunctionCompilation (this=this@entry=0x7fffffffd020, env=env@entry=0x7fffffffcfb0, wire_bytes_storage=wire_bytes_storage@entry=0x555555676b58, counters=counters@entry=0x555555611e68, detected=0x7fffffffd02c) at ../../src/wasm/function-compiler.cc:157
#10 0x00007ffff696ef07 in v8::internal::wasm::WasmCompilationUnit::ExecuteCompilation (this=0x7fffffffd020, env=0x7fffffffcfb0, wire_bytes_storage=0x555555676b58, counters=0x555555611e68, detected=<optimized out>) at ../../src/wasm/function-compiler.cc:31
#11 0x00007ffff69bce09 in v8::internal::wasm::CompileLazy (isolate=isolate@entry=0x555555600000, trusted_instance_data=trusted_instance_data@entry=..., func_index=func_index@entry=2) at ../../src/wasm/module-compiler.cc:1204
#12 0x00007ffff68216c2 in v8::internal::__RT_impl_Runtime_WasmCompileLazy (args=..., isolate=isolate@entry=0x555555600000) at ../../src/runtime/runtime-wasm.cc:434
#13 0x00007ffff6821060 in v8::internal::Runtime_WasmCompileLazy (args_length=<optimized out>, args_object=0x7fffffffd180, isolate=0x555555600000) at ../../src/runtime/runtime-wasm.cc:421
#14 0x00007ffff49caf57 in Builtins_WasmCEntry () from /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so
#15 0x00007ffff499cb55 in Builtins_WasmCompileLazy () from /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so
#16 0x0000000000000004 in ?? ()
#17 0x0000065600046ecd in ?? ()
```