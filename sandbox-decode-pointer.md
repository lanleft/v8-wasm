


## external pointer

## code pointer

```js


// src/sandbox/code-pointer-table-inl.h:24

void CodePointerTableEntry::MakeCodePointerEntry(Address code,
                                                 Address entrypoint,
                                                 CodeEntrypointTag tag,
                                                 bool mark_as_alive) {
//....
  if (mark_as_alive) code |= kMarkingBit;
  entrypoint_.store(entrypoint ^ tag, std::memory_order_relaxed);
  code_.store(code, std::memory_order_relaxed);
}
/// ==================================================
pwndbg> p code
$2 = 0x3440024f3ec

// 
pwndbg> p code
$3 = 0x3440024f428
pwndbg> p code
$4 = 0x3440024f464

v8::internal::CodePointerTableEntry::MakeCodePointerEntry (this=0x7fff90010030, code=code@entry=0x3440024f4a0, entrypoint=entrypoint@entry=0x0, tag=tag@entry=v8::internal::kDefaultCodeEntrypointTag, mark_as_alive=0x0)

v8::internal::CodePointerTableEntry::MakeCodePointerEntry (this=0x7fff90010040, code=code@entry=0x3440024f4dc, entrypoint=entrypoint@entry=0x0, tag=tag@entry=v8::internal::kDefaultCodeEntrypointTag, mark_as_alive=0x0)

v8::internal::CodePointerTableEntry::MakeCodePointerEntry (this=0x7fff90010050, code=code@entry=0x3440024f518, entrypoint=entrypoint@entry=0x0, tag=tag@entry=v8::internal::kDefaultCodeEntrypointTag, mark_as_alive=0x0)
/// ====================================================================

// code table
pwndbg> x/30gx 0x7fff90010030
0x7fff90010030:	0x00ff7fff7f4819c0	0x000003440024f4a0
0x7fff90010040:	0x00ff7fff7f482180	0x000003440024f4dc
0x7fff90010050:	0x00ff7fff7f482340	0x000003440024f518
0x7fff90010060:	0x00ff7fff7f482400	0x000003440024f554
0x7fff90010070:	0x00ff7fff7f482640	0x000003440024f590
0x7fff90010080:	0x00ff7fff7f482800	0x000003440024f5cc
0x7fff90010090:	0x00ff7fff7f482900	0x000003440024f608
0x7fff900100a0:	0x00ff7fff7f482ac0	0x000003440024f644
0x7fff900100b0:	0x00ff7fff7f482d00	0x000003440024f680
0x7fff900100c0:	0x00ff7fff7f483000	0x000003440024f6bc
0x7fff900100d0:	0x00ff7fff7f483100	0x000003440024f6f8
0x7fff900100e0:	0x00ff7fff7f484080	0x000003440024f734
0x7fff900100f0:	0x00ff7fff7f484180	0x000003440024f770
0x7fff90010100:	0x00ff7fff7f484280	0x000003440024f7ac
0x7fff90010110:	0x00ff7fff7f484380	0x000003440024f7e8


$6 = (std::__Cr::atomic<unsigned long> *) 0x7fff90010008


DebugPrint: 0x1a970004a3a9: [JSTypedArray]
 - map: 0x1a9700283979 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x1a9700283a0d <Object map = 0x1a97002839a1>
 - elements: 0x1a9700000ec1 <ByteArray[0]> [INT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x1a970004a365 <ArrayBuffer map = 0x1a9700289fcd>
 - byte_offset: 0
 - byte_length: 150
 - length: 150
 - data_ptr: 0x1a9800000100
   - base_pointer: (nil)
   - external_pointer: 0x1a9800000100
 - properties: 0x1a9700000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - elements: 0x1a9700000ec1 <ByteArray[0]> {
       0-149: 0
 }
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x1a9700283979: [Map] in OldSpace
 - map: 0x1a97002816d9 <MetaMap (0x1a9700281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: INT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x1a9700000069 <undefined>
 - prototype_validity cell: 0x1a9700000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x1a9700000759 <DescriptorArray[0]>
 - prototype: 0x1a9700283a0d <Object map = 0x1a97002839a1>
 - constructor: 0x1a9700283945 <JSFunction Int8Array (sfi = 0x1a970027c22d)>
 - dependent code: 0x1a9700000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

=====================================================================
DebugPrint: 0x1a9700299bdd: [Function] in OldSpace
 - map: 0x1a9700281ea1 <Map[32](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x1a9700281dc9 <JSFunction (sfi = 0x1a97001474d1)>
 - elements: 0x1a9700000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - function prototype: 
 - initial_map: 
 - shared_info: 0x1a9700299b25 <SharedFunctionInfo foo>
 - name: 0x1a97002999f5 <String[3]: #foo>
 - builtin: InterpreterEntryTrampoline
 - formal_parameter_count: 0
 - kind: NormalFunction
 - context: 0x1a9700299bc5 <ScriptContext[4]>
 - code: 0x1a97002505bd <Code BUILTIN InterpreterEntryTrampoline>
 - interpreted
 - bytecode: 0x3f4f00040135 <BytecodeArray[96]>
 - source code: () {
    const v11 = new Int8Array(150);
    Object(v11,...v11,v11);
  }
 - properties: 0x1a9700000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x1a9700000d99: [String] in ReadOnlySpace: #length: 0x1a9700271bbd <AccessorInfo name= 0x1a9700000d99 <String[6]: #length>, data= 0x1a9700000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x1a9700000dc5: [String] in ReadOnlySpace: #name: 0x1a9700271ba5 <AccessorInfo name= 0x1a9700000dc5 <String[4]: #name>, data= 0x1a9700000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x1a9700004215: [String] in ReadOnlySpace: #arguments: 0x1a9700271b75 <AccessorInfo name= 0x1a9700004215 <String[9]: #arguments>, data= 0x1a9700000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
    0x1a97000044a9: [String] in ReadOnlySpace: #caller: 0x1a9700271b8d <AccessorInfo name= 0x1a97000044a9 <String[6]: #caller>, data= 0x1a9700000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
    0x1a9700000dad: [String] in ReadOnlySpace: #prototype: 0x1a9700271bd5 <AccessorInfo name= 0x1a9700000dad <String[9]: #prototype>, data= 0x1a9700000069 <undefined>> (const accessor descriptor, attrs: [W__]), location: descriptor
 }
 - feedback vector: 0x1a9700299c9d: [FeedbackVector] in OldSpace
 - map: 0x1a97000007e1 <Map(FEEDBACK_VECTOR_TYPE)>
 - length: 25
 - shared function info: 0x1a9700299b25 <SharedFunctionInfo foo>
 - no optimized code
 - tiering state: TieringState::kNone
 - maybe has maglev code: 0
 - maybe has turbofan code: 0
 - invocation count: 1
 - closure feedback cell array: 0x1a97000020a5: [ClosureFeedbackCellArray] in ReadOnlySpace
 - map: 0x1a97000007b9 <Map(CLOSURE_FEEDBACK_CELL_ARRAY_TYPE)>
 - length: 0
 - elements:

 - slot #0 LoadGlobalNotInsideTypeof UNINITIALIZED {
     [0]: [cleared]
     [1]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #2 Call UNINITIALIZED {
     [2]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
     [3]: 0
  }
 - slot #4 LoadGlobalNotInsideTypeof UNINITIALIZED {
     [4]: [cleared]
     [5]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #6 Literal  {
     [6]: 0
  }
 - slot #7 StoreInArrayLiteral MONOMORPHIC {
     [7]: [weak] 0x1a970028d165 <Map[16](PACKED_ELEMENTS)>
     [8]: 0x1a97002519a9 <Code BUILTIN StoreFastElementIC_NoTransitionGrowAndHandleCOW>
  }
 - slot #9 LoadProperty UNINITIALIZED {
     [9]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
     [10]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #11 Call UNINITIALIZED {
     [11]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
     [12]: 0
  }
 - slot #13 LoadProperty UNINITIALIZED {
     [13]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
     [14]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #15 LoadProperty MONOMORPHIC
   [weak] 0x1a9700290471 <Map[20](HOLEY_ELEMENTS)>: LoadHandler(Smi)(kind = kField, is in object = 1, is double = 0, field index = 3) {
     [15]: [weak] 0x1a9700290471 <Map[20](HOLEY_ELEMENTS)>
     [16]: 1668
  }
 - slot #17 LoadProperty UNINITIALIZED {
     [17]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
     [18]: 0x1a9700000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #19 BinaryOp BinaryOp:SignedSmall {
     [19]: 1
  }
 - slot #20 Call MONOMORPHIC {
     [20]: [weak] 0x1a970028ff49 <JSFunction next (sfi = 0x1a970027778d)>
     [21]: 512
  }
 - slot #22 LoadProperty MONOMORPHIC
   [weak] 0x1a9700290471 <Map[20](HOLEY_ELEMENTS)>: LoadHandler(Smi)(kind = kField, is in object = 1, is double = 0, field index = 4) {
     [22]: [weak] 0x1a9700290471 <Map[20](HOLEY_ELEMENTS)>
     [23]: 2180
  }
 - slot #24 JumpLoop JumpLoop {
     [24]: [cleared]
  }
0x1a9700281ea1: [Map] in OldSpace
 - map: 0x1a97002816d9 <MetaMap (0x1a9700281729 <NativeContext[295]>)>
 - type: JS_FUNCTION_TYPE
 - instance size: 32
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - callable
 - constructor
 - has_prototype_slot
 - back pointer: 0x1a9700000069 <undefined>
 - prototype_validity cell: 0x1a9700000a89 <Cell value= 1>
 - instance descriptors (own) #5: 0x1a9700281ec9 <DescriptorArray[5]>
 - prototype: 0x1a9700281dc9 <JSFunction (sfi = 0x1a97001474d1)>
 - constructor: 0x1a9700281e6d <JSFunction Function (sfi = 0x1a9700276e5d)>
 - dependent code: 0x1a9700000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

```

```cpp
pwndbg> bt
#0  v8::internal::HeapObject::map_word (this=0x7fffffffd218, cage_base=..., tag=...) at ../../src/objects/objects-inl.h:1271
#1  v8::internal::HeapObject::map (this=0x7fffffffd218, cage_base=...) at ../../src/objects/objects-inl.h:1098
#2  v8::internal::HeapObject::HeapObjectPrint (this=0x7fffffffd218, os=...) at ../../src/diagnostics/objects-printer.cc:127
#3  0x00007ffff6126e26 in v8::internal::Print<(v8::internal::HeapObjectReferenceType)0, unsigned long> (ptr=..., os=...) at ../../third_party/libc++/src/include/ostream:787
#4  0x00007ffff60371b9 in v8::internal::CheckObjectType (raw_value=0x1a97ffffffff, raw_type=<optimized out>, raw_location=0x1a97000202d5) at ../../src/objects/object-type.cc:78
#5  0x00007fff7f5111f4 in ?? ()
#6  0x00007fffffffd3a8 in ?? ()


```