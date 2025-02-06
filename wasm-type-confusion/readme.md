# Wasm Type Confusion 

## Table of Content

<!-- toc -->

- [Wasm Exception Type](#wasm-exception-type)
  * [Use wasm_null for exnref](#use-wasm_null-for-exnref)
  * [Type confusion due to DefaultReferenceValue() `undefined` default value for kNoExtern](#type-confusion-due-to-defaultreferencevalue-undefined-default-value-for-knoextern)
  * [Type confusion in v8 wasm](#type-confusion-in-v8-wasm)
- [Wasm Wrapper](#wasm-wrapper)
  * [Use currect signature ndex fore tier-up of wasm-to-js wrapper](#use-currect-signature-ndex-fore-tier-up-of-wasm-to-js-wrapper)
  * [Arbitrary WASM type confusion due to module confusion in wasm-to-js tier-up](#arbitrary-wasm-type-confusion-due-to-module-confusion-in-wasm-to-js-tier-up)
- [Wasm Module](#wasm-module)
  * [Type confusion due to improper WASM module size check in `AsyncStreamingDecoder`](#type-confusion-due-to-improper-wasm-module-size-check-in-asyncstreamingdecoder)
- [Wasm Tag](#wasm-tag)
  * [WASM type confusion due to imported tag signature subtyping](#wasm-type-confusion-due-to-imported-tag-signature-subtyping)
- [JSPI](#jspi)
  * [JSPI stack switching breaks lazy deoptimization guarantees, leading to type confusion](#jspi-stack-switching-breaks-lazy-deoptimization-guarantees-leading-to-type-confusion)

<!-- tocstop -->

## Wasm Exception Type

### Use wasm_null for exnref

- Commit: https://chromium-review.googlesource.com/c/v8/v8/+/5953226

> Wasm type nullability confusion due to allowing non-nullable exn in catch_ref / catch_all_ref. These operations can catch any non-trap exceptions, including null that could be thrown from JS. However, the catch type is allowed to be non-nullable, resulting in type nullability confusion issue that is exploitable through Turboshaft optimization.

[testcase](pocs/poc-374790906.js)

### Type confusion due to DefaultReferenceValue() `undefined` default value for kNoExtern

- Issue: https://issues.chromium.org/issues/372269618

**Summary**

DefaultReferenceValue() returns undefined value as a default value for externref (kExtern) and nullexternref (kNoExtern). This is a violation of wasm-gc spec as only null values are allowed for reference types. This results in type confusion due to inconsistencies from nullity checks being bypassed.

**Details**

DefaultReferenceValue() returns undefined value as a default value for externref (i.e. kExtern) and nullexternref (i.e. kNoExtern):

```c++
i::Handle<i::HeapObject> DefaultReferenceValue(i::Isolate* isolate,
                                               i::wasm::ValueType type) {
  DCHECK(type.is_object_reference());
  // Use undefined for JS type (externref) but null for wasm types as wasm does
  // not know undefined.
  if (type.heap_representation() == i::wasm::HeapType::kExtern ||
      type.heap_representation() == i::wasm::HeapType::kNoExtern) {
    return isolate->factory()->undefined_value();                     // [!] undefined, not null
  }
  return isolate->factory()->wasm_null();
}
```
This results in type confusion as the only allowed value for a nullexternref is a JS null.

The bug has multiple potential problems:

Optimizing compilers (turbofan, turboshaft) may falsely optimize out code as unreachable, resulting in typer problems
kNoExtern but undefined value may be confused into other types like kExternString

[testcase]()

### Type confusion in v8 wasm

- Issue: https://issues.chromium.org/issues/332081797

**Root Cause**

[0] In the DefaultValueForType function within src/wasm/constant-expression-interface.cc, when setting the default value for RefNull, if the type is kWasmExternRef, kWasmNullExternRef, or kWasmExnRef, it is set to null_value; otherwise, it is set to wasm_null.

```c++
case kRefNull:
    return WasmValue(
        type == kWasmExternRef || type == kWasmNullExternRef ||
                type == kWasmExnRef
            ? Handle<Object>::cast(isolate->factory()->null_value())
            : Handle<Object>::cast(isolate->factory()->wasm_null()), // ==> [0]
        type);
```
[1] However, elsewhere, pointers of type kWasmNullExnRef also use null_value as the basis for determining whether the pointer is null, such as in the LoadNullValue function within src/wasm/compiler/liftoff-compiler.cc.

```c++
void LoadNullValue(Register null, ValueType type) {
  __ LoadFullPointer(
      null, kRootRegister,
      type == kWasmExternRef || type == kWasmNullExternRef ||
              type == kWasmExnRef || type == kWasmNullExnRef // ==> [1]
          ? IsolateData::root_slot_offset(RootIndex::kNullValue)
          : IsolateData::root_slot_offset(RootIndex::kWasmNull));
}
```

[2] The inconsistency between assigning and checking for null pointers before and after could potentially lead to type confusion.

[testcase](pocs/poc-332081797.js)


## Wasm Wrapper

### Use currect signature ndex fore tier-up of wasm-to-js wrapper

- Commit patch: https://chromium-review.googlesource.com/c/v8/v8/+/5291374

> The wasm-to-js wrapper tierup used the canonicalized signature id lookup
for module-independent signatures to look up the canonicalized signature
id of module-specific signatures. With this CL the signature id is
looked up with the function index of imported functions and from the
dispatch table for indirect function calls instead.

[testcase](pocs/regress-324596281.js)

### Arbitrary WASM type confusion due to module confusion in wasm-to-js tier-up

- Isuse: https://issues.chromium.org/issues/371565065

[testcase](pocs/poc-371565065.js)


## Wasm Module

### Type confusion due to improper WASM module size check in `AsyncStreamingDecoder`

- Issue:  https://issues.chromium.org/issues/368241697

[testcase]()

## Wasm Tag

### WASM type confusion due to imported tag signature subtyping

- Issue: 

[testcase](pocs/poc-365802567.js)


## JSPI

### JSPI stack switching breaks lazy deoptimization guarantees, leading to type confusion

- Issue: https://issues.chromium.org/issues/365376497

[testcase](pocs/poc-365376497.js)

