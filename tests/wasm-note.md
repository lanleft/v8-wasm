

```js


d8.file.execute("/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js");

let memory = new WebAssembly.Memory({initial: 5, maximum: 50, shared: true});
var builder = new WasmModuleBuilder();
builder.addImportedMemory("m", "memory", 5, 100, "shared");
builder.addFunction("grow_twice", kSig_i_i)
.addBody([kExprLocalGet, 0,
    kExprMemoryGrow, kMemoryZero,
    kExprDrop,
    kExprLocalGet, 0,
    kExprMemoryGrow, kMemoryZero])
.exportFunc();
var module = new WebAssembly.Module(builder.toBuffer());
let obj = {memory: memory, module: module};

%DebugPrint(job);

==================================================================
heap_addr: 0x1d9e00040000
started_array: 0x1da100000000
==================================================================
DebugPrint: 0x1d9e00069e45: [JS_OBJECT_TYPE]
 - map: 0x1d9e002b0871 <Map[20](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x1d9e00282611 <Object map = 0x1d9e00281c25>
 - elements: 0x1d9e00000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x1d9e00000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x1d9e00299c6d: [String] in OldSpace: #memory: 0x1d9e002ae12d <Memory map = 0x1d9e0028f731> (const data field 0, attrs: [WEC]), location: in-object
    0x1d9e00299dd5: [String] in OldSpace: #module: 0x1d9e00069e31 <Module map = 0x1d9e0028f3ad> (const data field 1, attrs: [WEC]), location: in-object
 }
0x1d9e002b0871: [Map] in OldSpace
 - map: 0x1d9e002816d9 <MetaMap (0x1d9e00281729 <NativeContext[295]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 20
 - inobject properties: 2
 - unused property fields: 0
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x1d9e002b0819 <Map[20](HOLEY_ELEMENTS)>
 - prototype_validity cell: 0x1d9e00000a89 <Cell value= 1>
 - instance descriptors (own) #2: 0x1d9e00069e75 <DescriptorArray[2]>
 - prototype: 0x1d9e00282611 <Object map = 0x1d9e00281c25>
 - constructor: 0x1d9e00282139 <JSFunction Object (sfi = 0x1d9e0027652d)>
 - dependent code: 0x1d9e00000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

```

Growing memory

```js

let memory = new WebAssembly.Memory({initial: 5, maximum: 65536, shared: true});
%DebugPrint(memory);
%SystemBreak();

memory.grow(65530);

/// ==================================================
```

wasm 
```js


heap_addr: 0x140c00040000

=========================== GSAB =================================
DebugPrint: 0x140c00049ca9: [JSTypedArray]
 - map: 0x140c0028d23d <Map[76](RAB_GSAB_UINT8ELEMENTS)> [FastProperties]
 - prototype: 0x140c002838a1 <Object map = 0x140c00283835>
 - elements: 0x140c00000ec1 <ByteArray[0]> [RAB_GSAB_UINT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x140c00049c65 <SharedArrayBuffer map = 0x140c00291375>
 - byte_offset: 34212362
 - byte_length: 0
 - length: 0
 - data_ptr: 0x140f00000000
   - base_pointer: (nil)
   - external_pointer: 0x140f00000000
 - length-tracking
 - properties: 0x140c00000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x140c0028d23d: [Map] in OldSpace
 - map: 0x140c002816d9 <MetaMap (0x140c00281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: RAB_GSAB_UINT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x140c00000069 <undefined>
 - prototype_validity cell: 0x140c00000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x140c00000759 <DescriptorArray[0]>
 - prototype: 0x140c002838a1 <Object map = 0x140c00283835>
 - constructor: 0x140c002837d9 <JSFunction Uint8Array (sfi = 0x140c0027c1fd)>
 - dependent code: 0x140c0004a0c9 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

=====================================================================
DebugPrint: 0x140c0029a661: [Function] in OldSpace
 - map: 0x140c002926fd <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x140c00281dc9 <JSFunction (sfi = 0x140c001474d1)>
 - elements: 0x140c00000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - function prototype: <no-prototype-slot>
 - shared_info: 0x140c0029a631 <SharedFunctionInfo js-to-wasm::i>
 - name: 0x140c000027e1 <String[1]: #0>
 - builtin: JSToWasmWrapper
 - formal_parameter_count: 0
 - kind: NormalFunction
 - context: 0x140c00281729 <NativeContext[295]>
 - code: 0x140c00265afd <Code BUILTIN JSToWasmWrapper>
 - Wasm instance data: 0x3e95000402ed <Other heap object (WASM_TRUSTED_INSTANCE_DATA_TYPE)>
 - Wasm function index: 0
 - properties: 0x140c00000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x140c00000d99: [String] in ReadOnlySpace: #length: 0x140c00271bbd <AccessorInfo name= 0x140c00000d99 <String[6]: #length>, data= 0x140c00000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x140c00000dc5: [String] in ReadOnlySpace: #name: 0x140c00271ba5 <AccessorInfo name= 0x140c00000dc5 <String[4]: #name>, data= 0x140c00000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x140c00004215: [String] in ReadOnlySpace: #arguments: 0x140c00271b75 <AccessorInfo name= 0x140c00004215 <String[9]: #arguments>, data= 0x140c00000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
    0x140c000044a9: [String] in ReadOnlySpace: #caller: 0x140c00271b8d <AccessorInfo name= 0x140c000044a9 <String[6]: #caller>, data= 0x140c00000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
 }
 - feedback vector: feedback metadata is not available in SFI
0x140c002926fd: [Map] in OldSpace
 - map: 0x140c002816d9 <MetaMap (0x140c00281729 <NativeContext[295]>)>
 - type: JS_FUNCTION_TYPE
 - instance size: 28
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - callable
 - back pointer: 0x140c00000069 <undefined>
 - prototype_validity cell: 0x140c00000a89 <Cell value= 1>
 - instance descriptors (own) #4: 0x140c00292725 <DescriptorArray[4]>
 - prototype: 0x140c00281dc9 <JSFunction (sfi = 0x140c001474d1)>
 - constructor: 0x140c00281e6d <JSFunction Function (sfi = 0x140c00276e5d)>
 - dependent code: 0x140c00000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

heap_addr: 0x140c00040000
//// ========================================
pwndbg> job 0x3e95000402ed
0x3e95000402ed: [WasmTrustedInstanceData]
 - map: 0x140c00001f3d <Map[200](WASM_TRUSTED_INSTANCE_DATA_TYPE)>
 - instance_object: 0x140c0029a531 <Instance map = 0x140c0028f4d5>
 - native_context: 0x140c00281729 <NativeContext[295]>
 - shared_part: 0x3e95000402ed <Other heap object (WASM_TRUSTED_INSTANCE_DATA_TYPE)>
 - memory_objects: 0x140c00049e7d <FixedArray[1]>
 - tables: 0x140c00049f49 <FixedArray[1]>
 - dispatch_table0: 0x3e95000403c1 <WasmDispatchTable[0]>
 - dispatch_tables: 0x3e95000403b5 <Other heap object (PROTECTED_FIXED_ARRAY_TYPE)>
 - dispatch_table_for_imports: 0x3e95000402bd <WasmDispatchTable[0]>
 - func_refs: 0x140c00049e71 <FixedArray[1]>
 - managed_object_maps: 0x140c00049f79 <FixedArray[1]>
 - feedback_vectors: 0x140c0029a5d9 <FixedArray[1]>
 - well_known_imports: 0x140c00000725 <FixedArray[0]>
 - memory0_start: 0x140f80010000
 - memory0_size: 65536
 - new_allocation_limit_address: 0x5555555fd0d0
 - new_allocation_top_address: 0x5555555fd0c8
 - old_allocation_limit_address: 0x5555555fd0e8
 - old_allocation_top_address: 0x5555555fd0e0
 - globals_start: 0x150bffffffff
 - imported_mutable_globals: 0x140c00000ec1 <ByteArray[0]>
 - isorecursive_canonical_types: 0x555555688890
 - jump_table_start: 0x2b641af43000
 - data_segment_starts: 0x140c00000ec1 <ByteArray[0]>
 - data_segment_sizes: 0x140c00000ec1 <ByteArray[0]>
 - element_segments: 0x140c00000725 <FixedArray[0]>
 - hook_on_function_call_address: 0x5555555fce29
 - tiering_budget_array: 0x555555669d00
 - memory_bases_and_sizes: 0x3e95000402c9 <Other heap object (TRUSTED_BYTE_ARRAY_TYPE)>
 - break_on_entry: 0


```

## Comparing webassembly memory with array 
```js

// gasb
DebugPrint: 0x10bf00049ff9: [JSArrayBuffer]
 - map: 0x10bf00291375 <Map[68](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x10bf002914bd <Object map = 0x10bf0029139d>
 - elements: 0x10bf00000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - backing_store: 0x10c200000000
 - byte_length: 0
 - max_byte_length: 16962

============================================================
// wasm memory.buffer
heap_addr: 0x10bf00040000
DebugPrint: 0x10bf0004a3d9: [JSArrayBuffer]
 - map: 0x10bf0029aa6d <Map[68](HOLEY_FROZEN_ELEMENTS)> [FastProperties]
 - prototype: 0x10bf002914bd <Object map = 0x10bf0029139d>
 - elements: 0x10bf00000725 <FixedArray[0]> [HOLEY_FROZEN_ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - backing_store: 0x10c280010000
 - byte_length: 65536
 - max_byte_length: 65536

=====================================================================

```

wasm code
```go
--- End code ---
--- WebAssembly code ---
name: wasm-function[0]
index: 0
kind: wasm function
compiler: Liftoff
Body (size = 256 = 232 + 24 padding)
Instructions (size = 220)
0x39de7c0c8880     0  4531e4               xorl r12,r12
0x39de7c0c8883     3  e8e8f8ffff           call 0x39de7c0c8170  (jump table)
0x39de7c0c8888     8  4881ec08000000       REX.W subq rsp,0x8
0x39de7c0c888f     f  8bc0                 movl rax,rax
0x39de7c0c8891    11  8bd2                 movl rdx,rdx
0x39de7c0c8893    13  8b4eff               movl rcx,[rsi-0x1]
0x39de7c0c8896    16  4903ce               REX.W addq rcx,r14
0x39de7c0c8899    19  0fb74907             movzxwl rcx,[rcx+0x7]
0x39de7c0c889d    1d  81f9b6000000         cmpl rcx,0xb6
0x39de7c0c88a3    23  0f8420000000         jz 0x39de7c0c88c9  <+0x49>
0x39de7c0c88a9    29  bf47000000           movl rdi,0x47
0x39de7c0c88ae    2e  4989e2               REX.W movq r10,rsp
0x39de7c0c88b1    31  4883ec08             REX.W subq rsp,0x8
0x39de7c0c88b5    35  4883e4f0             REX.W andq rsp,0xf0
0x39de7c0c88b9    39  4c891424             REX.W movq [rsp],r10
0x39de7c0c88bd    3d  48b8107a6af5ff7f0000 REX.W movq rax,0x7ffff56a7a10
0x39de7c0c88c7    47  ffd0                 call rax
0x39de7c0c88c9    49  493b65a0             REX.W cmpq rsp,[r13-0x60]
0x39de7c0c88cd    4d  0f8669000000         jna 0x39de7c0c893c  <+0xbc>
0x39de7c0c88d3    53  488b4e17             REX.W movq rcx,[rsi+0x17]
0x39de7c0c88d7    57  41baffffffff         movl r10,0xffffffff
0x39de7c0c88dd    5d  493bc2               REX.W cmpq rax,r10
0x39de7c0c88e0    60  761d                 jna 0x39de7c0c88ff  <+0x7f>
0x39de7c0c88e2    62  bf01000000           movl rdi,0x1
0x39de7c0c88e7    67  4989e2               REX.W movq r10,rsp
0x39de7c0c88ea    6a  4883ec08             REX.W subq rsp,0x8
0x39de7c0c88ee    6e  4883e4f0             REX.W andq rsp,0xf0
0x39de7c0c88f2    72  4c891424             REX.W movq [rsp],r10
0x39de7c0c88f6    76  488b05c2ffffff       REX.W movq rax,[rip+0xffffffc2]
0x39de7c0c88fd    7d  ffd0                 call rax
0x39de7c0c88ff    7f  891401               movl [rcx+rax*1],rdx
0x39de7c0c8902    82  4c8b566f             REX.W movq r10,[rsi+0x6f]
0x39de7c0c8906    86  41812abe000000       subl [r10],0xbe
0x39de7c0c890d    8d  0f8838000000         js 0x39de7c0c894b  <+0xcb>
0x39de7c0c8913    93  48837df808           REX.W cmpq [rbp-0x8],0x8
0x39de7c0c8918    98  741d                 jz 0x39de7c0c8937  <+0xb7>
0x39de7c0c891a    9a  bf2f000000           movl rdi,0x2f
0x39de7c0c891f    9f  4989e2               REX.W movq r10,rsp
0x39de7c0c8922    a2  4883ec08             REX.W subq rsp,0x8
0x39de7c0c8926    a6  4883e4f0             REX.W andq rsp,0xf0
0x39de7c0c892a    aa  4c891424             REX.W movq [rsp],r10
0x39de7c0c892e    ae  488b058affffff       REX.W movq rax,[rip+0xffffff8a]
0x39de7c0c8935    b5  ffd0                 call rax
0x39de7c0c8937    b7  488be5               REX.W movq rsp,rbp
0x39de7c0c893a    ba  5d                   pop rbp
0x39de7c0c893b    bb  c3                   retl
0x39de7c0c893c    bc  50                   push rax
0x39de7c0c893d    bd  52                   push rdx
0x39de7c0c893e    be  e8cdf9ffff           call 0x39de7c0c8310  (jump table)
0x39de7c0c8943    c3  5a                   pop rdx
0x39de7c0c8944    c4  58                   pop rax
0x39de7c0c8945    c5  488b75f0             REX.W movq rsi,[rbp-0x10]
0x39de7c0c8949    c9  eb88                 jmp 0x39de7c0c88d3  <+0x53>
0x39de7c0c894b    cb  50                   push rax
0x39de7c0c894c    cc  51                   push rcx
0x39de7c0c894d    cd  52                   push rdx
0x39de7c0c894e    ce  e80df8ffff           call 0x39de7c0c8160  (jump table)
0x39de7c0c8953    d3  5a                   pop rdx
0x39de7c0c8954    d4  59                   pop rcx
0x39de7c0c8955    d5  58                   pop rax
0x39de7c0c8956    d6  488b75f0             REX.W movq rsi,[rbp-0x10]
0x39de7c0c895a    da  ebb7                 jmp 0x39de7c0c8913  <+0x93>

Protected instructions:
 pc offset
        7f         

Source positions:
 pc offset  position
        7f         5  statement
        be         0  statement
        ce         8  statement

Safepoints (entries = 1, byte size = 11)
0x39de7c0c8943     c3  slots (sp->fp): 0000000000000000

RelocInfo (size = 0)

```