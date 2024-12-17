<!-- ============ -->

### WasmTagObject

This document provides detailed information about `WasmTagObject`, including its structure, usage, and examples of previous issues and their patched solutions.

## Table of Contents

<!-- toc -->

- [Overview](#overview)
- [Structure of WasmTagObject](#structure-of-wasmtagobject)
- [Usage Examples](#usage-examples)
  * [Example 1: Creating a WasmTagObject](#example-1-creating-a-wasmtagobject)
  * [Example 2: Matching Signature](#example-2-matching-signature)
  * [Example 3: Creating and Manipulating a WasmTagObject](#example-3-creating-and-manipulating-a-wasmtagobject)
- [Previous Issues and Solutions](#previous-issues-and-solutions)
  * [Issue 1: Wasm Tag Object Field Manipulation](#issue-1-wasm-tag-object-field-manipulation)
- [Conclusion](#conclusion)

<!-- tocstop -->

## Overview
The `WasmTagObject` is utilized in the V8 Wasm sandbox environment to manage and handle WebAssembly tag objects. It provides a structured way to interact with WebAssembly tags, ensuring proper memory handling and object identification.

## Structure of WasmTagObject
The `WasmTagObject` consists of several internal fields, including:
- `serialized_signature`: A serialized representation of the function signature associated with the tag.
- `tag`: A `HeapObject` representing the tag.
- `canonical_type_index`: An index representing the canonical type of the tag.
- `trusted_data`: A pointer to the `WasmTrustedInstanceData`.

```cpp
extern class WasmTagObject extends JSObject {
  serialized_signature: PodArrayOfWasmValueType;
  tag: HeapObject;
  canonical_type_index: Smi;
  trusted_data: TrustedPointer<WasmTrustedInstanceData>;
}
```

## Usage Examples
Here are some examples of how `WasmTagObject` can be used:

### Example 1: Creating a WasmTagObject
```cpp
Handle<WasmTagObject> tag_object = WasmTagObject::New(isolate, sig, type_index, tag, trusted_data);
```
This code snippet demonstrates how to create a new `WasmTagObject` with the specified signature, type index, tag, and trusted data.

### Example 2: Matching Signature
```cpp
bool matches = tag_object->MatchesSignature(expected_index);
```
This code snippet checks if the `WasmTagObject` matches a given signature index.

### Example 3: Creating and Manipulating a WasmTagObject
```javascript
let dummy_tag = new WebAssembly.Tag({parameters: ['i64'], returns: []});
let dummy_tag_ptr = getPtr(dummy_tag);
let dummy_sig_ptr = getField(dummy_tag_ptr, kWasmTagObjectSerializedSignatureOffset);
let ByteArrayMap = getField(dummy_sig_ptr, 0);
```

## Previous Issues and Solutions

### Issue 1: Wasm Tag Object Field Manipulation
- Issue: https://issuetracker.google.com/issues/336507783
- **Description:** This issue relates to improper handling of Wasm tag object fields which could lead to security vulnerabilities.
- **Solution:** Implement strict validation and bounds checking for Wasm tag object fields.


## Conclusion
The `WasmTagObject` is a crucial element in WebAssembly, providing dynamic tag management capabilities. Addressing the outlined issues and implementing the proposed solutions can enhance the security and stability of Wasm applications.

For more details, you can view the [source code](https://github.com/v8/v8/blob/main/src/wasm/wasm-objects.tq#L240-L323).
