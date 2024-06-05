

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