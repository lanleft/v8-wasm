
# WasmTableObject

This document provides detailed information about `WasmTableObject`, including its structure, usage, and examples of previous issues and their patched solutions.

## Table of Contents
- [Overview](#overview)
- [Structure of WasmTableObject](#structure-of-wasmtableobject)
- [Usage Examples](#usage-examples)
- [Previous Issues and Solutions](#previous-issues-and-solutions)
  - [Issue 1: Corruption of Table Types](#issue-1-corruption-of-table-types)
  - [Issue 2: Bypassing Checks in WasmDispatchTable](#issue-2-bypassing-checks-in-wasmdispatchtable)
  - [Issue 3: Out-of-Bound Access in WebAssembly](#issue-3-out-of-bound-access-in-webassembly)
- [Conclusion](#conclusion)

## Overview
The `WasmTableObject` is a fundamental component in WebAssembly for managing function tables. It allows dynamic linking of functions, enabling more flexible and powerful module interactions.

## Structure of WasmTableObject
The `WasmTableObject` consists of several internal fields, including:
- `entries`: An array of function references.
- `type`: The type signature of the functions stored in the table.
- `length`: The current number of elements in the table.

## Usage Examples
Here are some examples of how `WasmTableObject` can be used:

### Example 1: Setting Function Types
```javascript
let table1 = new WebAssembly.Table({ element: 'anyfunc', initial: 1 });
table1.set(0, new WebAssembly.Function(
  { parameters: [], results: ['i64'] },
  () => BigInt(Sandbox.targetPage)
));
```

### Example 2: Changing Table Types
```javascript
let t0 = getPtr(table0);
let t1 = getPtr(table1);
let t0_type = getField(t0, kWasmTableObjectTypeOffset);
setField(t1, kWasmTableObjectTypeOffset, t0_type);
```

## Previous Issues and Solutions

### Issue 1: Corruption of Table Types
**Description:** Manipulating the `type` field of a `WasmTableObject` could lead to inconsistencies and potential vulnerabilities.

**Solution:** Implement strict type checks and validation during table manipulation.

### Issue 2: Bypassing Checks in WasmDispatchTable
**Description:** Using negative numbers to bypass `SBXCHECK_LT` in `WasmDispatchTable::Set` function.

**Solution:** Ensure that index and length checks are robust and cannot be bypassed using negative values.

### Issue 3: Out-of-Bound Access in WebAssembly
**Description:** Exploiting WebAssembly's global variables to achieve out-of-bound read/write access.

**Solution:** Implement more stringent bounds checking and memory protection mechanisms.

## Conclusion
The `WasmTableObject` is a crucial element in WebAssembly, providing dynamic function management capabilities. Addressing the outlined issues and implementing the proposed solutions can enhance the security and reliability of WebAssembly applications.

---

For more detailed information and examples, you can refer to the [source files](https://github.com/lanleft/v8-wasm/tree/master/scripts/sandbox) in the repository.
