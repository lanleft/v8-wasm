# Wasm Type Confusion 

## Table of Content

<!-- toc -->

- [Wasm Exception Type](#wasm-exception-type)
  * [Use wasm_null for exnref](#use-wasm_null-for-exnref)
  * [Type confusion due to DefaultReferenceValue() `undefined` default value for kNoExtern](#type-confusion-due-to-defaultreferencevalue-undefined-default-value-for-knoextern)
  * [Type confusion due to DefaultReferenceValue() exnref wasm_null leakage](#type-confusion-due-to-defaultreferencevalue-exnref-wasm_null-leakage)
  * [Type confusion in v8 wasm](#type-confusion-in-v8-wasm)
- [Wasm Wrapper](#wasm-wrapper)
  * [Use currect signature ndex fore tier-up of wasm-to-js wrapper](#use-currect-signature-ndex-fore-tier-up-of-wasm-to-js-wrapper)
  * [Arbitrary WASM type confusion due to module confusion in wasm-to-js tier-up](#arbitrary-wasm-type-confusion-due-to-module-confusion-in-wasm-to-js-tier-up)
- [Wasm Module](#wasm-module)
  * [Type confusion due to improper WASM module size check in `AsyncStreamingDecoder`](#type-confusion-due-to-improper-wasm-module-size-check-in-asyncstreamingdecoder)
  * [Issue 330588502 - Improper validation when decoding types in `TypeSectionDecoder`](#issue-330588502---improper-validation-when-decoding-types-in-typesectiondecoder)
- [Wasm Tag](#wasm-tag)
  * [WASM type confusion due to imported tag signature subtyping](#wasm-type-confusion-due-to-imported-tag-signature-subtyping)
- [JSPI](#jspi)
  * [JSPI stack switching breaks lazy deoptimization guarantees, leading to type confusion](#jspi-stack-switching-breaks-lazy-deoptimization-guarantees-leading-to-type-confusion)
- [Wasm CanonicalType](#wasm-canonicaltype)
  * [CVE-2024-2887: Maximum Canonicaltype leads to type confusion](#cve-2024-2887-maximum-canonicaltype-leads-to-type-confusion)
  * [CVE-2024-6100 - Type confusion between canonicalType and HeapType/ValueType (June 2024)](#cve-2024-6100---type-confusion-between-canonicaltype-and-heaptypevaluetype-june-2024)
  * [CVE-2024-8194 - Another confusion between CanonicalType and ValueType (Aug 19 2024)](#cve-2024-8194---another-confusion-between-canonicaltype-and-valuetype-aug-19-2024)
  * [CVE-2024-9859 - Confusion between ValueType and CanonicalType in HE](#cve-2024-9859---confusion-between-valuetype-and-canonicaltype-in-he)
  * [CVE-2025-5959: TyphoonPWN 2025](#cve-2025-5959-typhoonpwn-2025)
  * [Issue 400086889: Arbitrary Wasm type confusion due to transient canonical index overflow](#issue-400086889-arbitrary-wasm-type-confusion-due-to-transient-canonical-index-overflow)
  * [Issue 388290793: WebAssembly out-of-bounds memory access due to broken memory64 guard page assumptions](#issue-388290793-webassembly-out-of-bounds-memory-access-due-to-broken-memory64-guard-page-assumptions)

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

[testcase](pocs/poc-372269618.js)

### Type confusion due to DefaultReferenceValue() exnref wasm_null leakage

- Issue: https://issues.chromium.org/issues/372285204

- Summary: Simple variant of [Type confusion in v8 wasm](#type-confusion-in-v8-wasm)

**Details**

DefaultReferenceValue() does not handle exnref or nullexnref values, resulting in type confusion where WasmNull is set to exnref / nullexnref. This can further be retrieved back to JS-side through throw_ref.

```c++
namespace {
i::Handle<i::HeapObject> DefaultReferenceValue(i::Isolate* isolate,
                                               i::wasm::ValueType type) {
  DCHECK(type.is_object_reference());
  // Use undefined for JS type (externref) but null for wasm types as wasm does
  // not know undefined.
  if (type.heap_representation() == i::wasm::HeapType::kExtern ||
      type.heap_representation() == i::wasm::HeapType::kNoExtern) {
    return isolate->factory()->undefined_value();
  }
  return isolate->factory()->wasm_null();
}
```

[testcase](pocs/poc-372285204.js)



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
Improper signature when re-importing an imported and then exported from another module. It calls from module B, but its signature is from module A, which causes inconsistency.

[testcase](pocs/poc-371565065.js)


## Wasm Module

### Type confusion due to improper WASM module size check in `AsyncStreamingDecoder`

- Issue:  https://issues.chromium.org/issues/368241697

[testcase]()

### Issue 330588502 - Improper validation when decoding types in `TypeSectionDecoder` 

Its root cause being improper implementation, which forget to boundcheck number of types when accessing standalone type (which is not recursive type)

Reported issue: https://issues.chromium.org/issues/330588502
Fix: https://chromium-review.googlesource.com/c/v8/v8/+/5378419

## Wasm Tag

### WASM type confusion due to imported tag signature subtyping

- Issue: 

[testcase](pocs/poc-365802567.js)


## JSPI

### JSPI stack switching breaks lazy deoptimization guarantees, leading to type confusion

- Issue: https://issues.chromium.org/issues/365376497

[testcase](pocs/poc-365376497.js)

## Wasm CanonicalType

### CVE-2024-2887: Maximum Canonicaltype leads to type confusion 

The root cause lays on `DecodeTypeSection` function, which only checks `kV8MaxWasmTypes` for recursive group size [1], but not for standalone type [3]. Combining with enum heap type starts from `kV8MaxWasmTypes` [4], so we could create canonical type that equals to normal heap type and makes type confusion.

```c++

  void DecodeTypeSection() {
    TypeCanonicalizer* type_canon = GetTypeCanonicalizer();
    uint32_t types_count = consume_count("types count", kV8MaxWasmTypes); // [1]

    for (uint32_t i = 0; ok() && i < types_count; ++i) {
      TRACE("DecodeType[%d] module+%d\n", i, static_cast<int>(pc_ - start_));
      uint8_t kind = read_u8<Decoder::FullValidationTag>(pc(), "type kind");
      size_t initial_size = module_->types.size();
      if (kind == kWasmRecursiveTypeGroupCode) {
        module_->is_wasm_gc = true;
        uint32_t rec_group_offset = pc_offset();
        consume_bytes(1, "rec. group definition", tracer_);
        if (tracer_) tracer_->NextLine();
        uint32_t group_size =
            consume_count("recursive group size", kV8MaxWasmTypes);
        if (tracer_) tracer_->RecGroupOffset(rec_group_offset, group_size);
        if (initial_size + group_size > kV8MaxWasmTypes) {  // [2]
          errorf(pc(), "Type definition count exceeds maximum %zu",
                 kV8MaxWasmTypes);
          return;
        }
//....
        if (failed()) return;
        type_canon->AddRecursiveGroup(module_.get(), group_size);
        if (tracer_) {
          tracer_->Description("end of rec. group");
          tracer_->NextLine();
        }
      } else {
        if (tracer_) tracer_->TypeOffset(pc_offset());
        // Similarly to above, we need to resize types for a group of size 1.
        module_->types.resize(initial_size + 1);
        module_->isorecursive_canonical_type_ids.resize(initial_size + 1); // [3]
        TypeDefinition type = consume_subtype_definition();
        if (ok()) {
          module_->types[initial_size] = type;
          type_canon->AddRecursiveSingletonGroup(module_.get());
        }
      }
    }
  }

class HeapType {
 public:
  enum Representation : uint32_t {
    kFunc = kV8MaxWasmTypes,  // shorthand: c // [4]
    kEq,                      // shorthand: q
    kI31,                     // shorthand: j
    kStruct,                  // shorthand: o
    kArray,                   // shorthand: g
    kAny,                     //
    kExtern,                  // shorthand: a.
    kExternString,            // Internal type for optimization purposes.
                              // Subtype of extern.
                              // Used by the js-builtin-strings proposal.
    kExn,                     //
    kString,                  // shorthand: w.
    kStringViewWtf8,          // shorthand: x.
    kStringViewWtf16,         // shorthand: y.
    kStringViewIter,          // shorthand: z.
    kNone,                    //
    //....
  };
  // ...
};



```

[POC](pocs/CVE-2024-2887.js)

### CVE-2024-6100 - Type confusion between canonicalType and HeapType/ValueType (June 2024)
In wasm proposal MVP, when check type equivalency, recursive type must be convert to iso-recursive type first. To represent equivalency between two types, WasmGC allow canonicalize type to support type comparison between recursive groups in different modules. 

The implementation of V8 would be:
```
https://issues.chromium.org/344608204#attachment56870020
1. Canonicalize type indexes in a recursive group by the following rule:
   1. Type indexes already defined (outside of its recursive group) -> use the already canonicalized value
   2. Type indexes representing a different type within the same group -> compute relative type index from the first type and mark as relative
2. If the canonicalized recursive group already exists in the database, use the saved indexes
3. Else, save the recursive group into the database and create new indexes (incrementally)
```
Which therefore give each type another index, canonical_idx. This one is to denote equality of 2 types inside the recursive group. 

Each type's canonical_idx is a uint32_t, and is stored in a vector in class TypeCanonicalizer. canonical_idx should not be confused with heap_type_idx.

While heap_type_idx has a upper bound (kV8MaxWasmTypes), canonical_idx does not. 

However, in some cases, canonical_idx is parsed to where heap_type should be:

```cpp
namespace wasm {
MaybeHandle<Object> JSToWasmObject(Isolate* isolate, Handle<Object> value,
                                   ValueType expected_canonical,
                                   const char** error_message) {
  //...
  switch (expected_canonical.heap_representation_non_shared()) {        //
    //...
    case HeapType::kAny: {                                          // [!] all non-null JS values allowed
      if (IsSmi(*value)) return CanonicalizeSmi(value, isolate);
      if (IsHeapNumber(*value)) {
        return CanonicalizeHeapNumber(value, isolate);
      }
      if (!IsNull(*value, isolate)) return value;
      *error_message = "null is not allowed for (ref any)";
      return {};
    }
    //...
  }
  //...
}
```
Which eventually leads to type confusion.

[POC](pocs/CVE-2024-6100.js)

Reported issue: https://issues.chromium.org/issues/344608204

Fix: https://chromium-review.googlesource.com/c/v8/v8/+/5604265

**Types in WasmGC**
 - Reading [MVP](https://github.com/WebAssembly/gc/blob/main/proposals/gc/MVP.md)

**Comparing CVE-2024-6100 and CVE-2024-2887: why 6100 was considered as the variant of 2887?**

- 6100: confusion between `canonical type index` vs. `module type index`

`isorecursive_canonical_type_type_ids[type.ref_index()]`

  + isorecursive: Isorecursive type system
  + canonical_type_type_ids: Canonicalized representation of the types

`expected_canonical.ref_index()` -> `(value &kMask) >> kShift` with kShift=2^20 

- Checking canolical subtype:

```c++
bool TypeCanonicalizer::IsCanonicalSubtype(uint32_t canonical_sub_index,
                                           uint32_t canonical_super_index) {
  // Multiple threads could try to register and access recursive groups
  // concurrently.
  // TODO(manoskouk): Investigate if we can improve this synchronization.
  base::MutexGuard mutex_guard(&mutex_);
  while (canonical_sub_index != kNoSuperType) {
    if (canonical_sub_index == canonical_super_index) return true;
    canonical_sub_index = canonical_supertypes_[canonical_sub_index];
  }
  return false;
}
```

### CVE-2024-8194 - Another confusion between CanonicalType and ValueType (Aug 19 2024)
Storing canonical_type_idx into wasm::ValueType

```cpp
ValueType TypeCanonicalizer::CanonicalizeValueType(
    const WasmModule* module, ValueType type,
    uint32_t recursive_group_start) const {
  if (!type.has_index()) return type;
  return type.ref_index() >= recursive_group_start
             ? ValueType::CanonicalWithRelativeIndex(
                   type.kind(), type.ref_index() - recursive_group_start)
             : ValueType::FromIndex(
                   type.kind(),
                   module->isorecursive_canonical_type_ids[type.ref_index()]);  // [!]
}

  constexpr uint32_t ref_index() const {
    DCHECK(has_index());
    return HeapTypeField::decode(bit_field_);
  }

  /********************** Type canonicalization utilities *********************/
  static constexpr ValueType CanonicalWithRelativeIndex(ValueKind kind,
                                                        uint32_t index) {
    return ValueType(KindField::encode(kind) | HeapTypeField::encode(index) |
                     CanonicalRelativeField::encode(true));
  }
  static constexpr ValueType FromIndex(ValueKind kind, uint32_t index) {
    DCHECK(kind == kRefNull || kind == kRef || kind == kRtt);
    return ValueType(KindField::encode(kind) | HeapTypeField::encode(index));
  }

  // KindField::encode = BitField<ValueKind, 0, 5> (ValueKind == uint8_t)  == kind << 0 (size = 5 bit)
  // HeapTypeField::encode = BitField<unsigned int, 5, 20>                 == index << 5 (size = 20 )
  // CanonicalRelativeField::encode = BitField<bool, 25, 1>                == true << 25 (size = 1)

  // A ValueType combines a (ValueKind and a heap representation)
  // encode == kind {0->5} | index {5->25} | is_canonical {25->26}

  // bit_field 
  // maxium(heap_type) = 2^20 = 0x200000
  // maximum(wasm_type) = 1000000 < maxium(heap_type)
  // 1000000 = 0xf4240

  /* In encode function, they don't truncate value field
  */
  // Returns a type U with the bit field value encoded.
  static constexpr U encode(T value) {
    DCHECK(is_valid(value));
    return static_cast<U>(value) << kShift;
  }
  // Extracts the bit field from the value.
  static constexpr T decode(U value) {
    return static_cast<T>((value & kMask) >> kShift);
  }

```

- In encode function, they don't truncate value field. So if the `heap_type` is equal (2^21), that turns into canonical bool enable


- The purpose of `TypeCanonicalizer::CanonicalizeValueType` function is canonicalize a ValueType
=> canonical_type_idx max was at 1 << 20, but wasm::ValueType's max at 1000000. This could lead to field overflow.

**Conclude**

```c++
ValueType TypeCanonicalizer::CanonicalizeValueType(
    const WasmModule* module, ValueType type,
    uint32_t recursive_group_start) const {
  if (!type.has_index()) return type;
  printf("CanonicalizeValueType: type.ref_index() = %d\n", type.ref_index());
  return type.ref_index() >= recursive_group_start
             ? ValueType::CanonicalWithRelativeIndex(
                   type.kind(), type.ref_index() - recursive_group_start)
             : ValueType::FromIndex(
                   type.kind(),
                   module->isorecursive_canonical_type_ids[type.ref_index()]);
}

// heaptype = index | (is_canonical << 20)

```

*`CanonicalWithRelativeIndex` function enables `CanonicalRelativeField` at `1<<20`, while `FromIndex` just shifts `index` with truncating if it's larger than `1<<20 == 0x100000`*


> The cidx of `0x100003` is loaded into HeapTypeField, overflowing into CanonicalRelativeField into 1, which make RecGroup 2 is canonicalized into RecGroup 1. However, they are not equivalent.

- Reported issue: https://issues.chromium.org/issues/360533914

- [POC](pocs/CVE-2024-8194.js)

### CVE-2024-9859 - Confusion between ValueType and CanonicalType in HE
When encoding a JS value in a wasm exception, it should be canonicalized first, since JSToWasmObject takes CanonicalValueType as an argument:
```c++
MaybeHandle<Object> JSToWasmObject(Isolate* isolate, Handle<Object> value,
                                   CanonicalValueType expected,
                                   const char** error_message) {


                                    
                                   }
```
However, it does not canonicalize before go to JS->Wasm wrapper. Therefore, it passes ValueType to JSToWasmObject instead of CanonicalValueType
Fix: https://chromium-review.googlesource.com/c/v8/v8/+/5633661

Reported issue: https://issues.chromium.org/issues/346197738

### CVE-2025-5959: TyphoonPWN 2025

- Blog: https://linz04.github.io/2025/06/20/CVE-2025-5959/

### Issue 400086889: Arbitrary Wasm type confusion due to transient canonical index overflow

- https://issues.chromium.org/issues/400086889

### Issue 388290793: WebAssembly out-of-bounds memory access due to broken memory64 guard page assumptions


Reported issue: https://issues.chromium.org/issues/388290793