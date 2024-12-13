
# WasmGlobalObject

This document provides detailed information about `WasmGlobalObject`, including its structure, usage, and examples of previous issues and their patched solutions.

## Table of Contents

<!-- toc -->
- [Overview](#overview)
- [Structure of WasmGlobalObject](#structure-of-wasmglobalobject)
- [Usage Examples](#usage-examples)
- [Previous Issues and Solutions](#previous-issues-and-solutions)
  - [Issue 1: Out-of-Bound Access in WebAssembly](#issue-1-out-of-bound-access-in-webassembly)
- [Conclusion](#conclusion)

## Overview
The `WasmGlobalObject` is crucial for managing global variables in WebAssembly. It allows for the storage and manipulation of global values, which can be accessed across different modules.

## Structure of WasmGlobalObject
The `WasmGlobalObject` consists of several internal fields, including:
- `value`: The actual value stored in the global variable.
- `type`: The type of the global variable (e.g., `i32`, `f64`).
- `mutable`: A flag indicating whether the global variable is mutable.

## Usage Examples
Here are some examples of how `WasmGlobalObject` can be used:

### Example 1: Setting Global Variables
```javascript
let global1 = new WebAssembly.Global({ value: 'i32', mutable: true }, 42);
global1.value = 84;  // Update the value
```

### Example 2: Accessing Global Variables
```javascript
let global2 = new WebAssembly.Global({ value: 'f64' }, 3.14);
console.log(global2.value);  // Retrieve the value
```

## Previous Issues and Solutions

### Issue 1: Out-of-Bound Access in WebAssembly

- Issue: https://issuetracker.google.com/issues/352689356
- Poc: [call-ref-turbofan.js](call-ref-turbofan.js)

**Description:** Exploiting WebAssembly's global variables to achieve out-of-bound read/write access.

**Solution:** Implement more stringent bounds checking and memory protection mechanisms.


## Conclusion
The `WasmGlobalObject` is an essential component in WebAssembly for managing global state. Addressing the outlined issues and implementing the proposed solutions can enhance the security and stability of WebAssembly applications.

---

For more detailed information and examples, you can refer to the [source files](https://github.com/lanleft/v8-wasm/tree/master/scripts/sandbox) in the repository.
