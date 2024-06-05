


```js
// search -t dword 0x299cf1 anon_2eb00040

heap_addr: 0x1ce500000000
dummy addr: 0x1ce50004f12c
======================================================================
DebugPrint: 0x1ce50004f12d: [JSTypedArray]
 - map: 0x1ce500283979 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x1ce500283a0d <Object map = 0x1ce5002839a1>
 - elements: 0x1ce500000ec1 <ByteArray[0]> [INT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x1ce50004f0e9 <ArrayBuffer map = 0x1ce500289fcd>
 - byte_offset: 0
 - byte_length: 150
 - length: 150
 - data_ptr: 0x1ce600000000
   - base_pointer: (nil)
   - external_pointer: 0x1ce600000000
 - properties: 0x1ce500000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - elements: 0x1ce500000ec1 <ByteArray[0]> {
       0-149: 0
 }
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x1ce500283979: [Map] in OldSpace
 - map: 0x1ce5002816d9 <MetaMap (0x1ce500281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: INT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x1ce500000069 <undefined>
 - prototype_validity cell: 0x1ce500000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x1ce500000759 <DescriptorArray[0]>
 - prototype: 0x1ce500283a0d <Object map = 0x1ce5002839a1>
 - constructor: 0x1ce500283945 <JSFunction Int8Array (sfi = 0x1ce50027c22d)>
 - dependent code: 0x1ce500000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

======================================================================
DebugPrint: 0x1ce500299fb1: [Function] in OldSpace
 - map: 0x1ce500281ea1 <Map[32](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x1ce500281dc9 <JSFunction (sfi = 0x1ce5001474d1)>
 - elements: 0x1ce500000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - function prototype: 
 - initial_map: 
 - shared_info: 0x1ce500299d2d <SharedFunctionInfo foo>
 - name: 0x1ce500299a85 <String[3]: #foo>
 - formal_parameter_count: 1
 - kind: NormalFunction
 - context: 0x1ce500299ed9 <ScriptContext[8]>
 - code: 0x27670008011d <Code MAGLEV>
 - source code: (i) {
  a[i];
}
 - properties: 0x1ce500000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x1ce500000d99: [String] in ReadOnlySpace: #length: 0x1ce500271bbd <AccessorInfo name= 0x1ce500000d99 <String[6]: #length>, data= 0x1ce500000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x1ce500000dc5: [String] in ReadOnlySpace: #name: 0x1ce500271ba5 <AccessorInfo name= 0x1ce500000dc5 <String[4]: #name>, data= 0x1ce500000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x1ce500004215: [String] in ReadOnlySpace: #arguments: 0x1ce500271b75 <AccessorInfo name= 0x1ce500004215 <String[9]: #arguments>, data= 0x1ce500000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
    0x1ce5000044a9: [String] in ReadOnlySpace: #caller: 0x1ce500271b8d <AccessorInfo name= 0x1ce5000044a9 <String[6]: #caller>, data= 0x1ce500000069 <undefined>> (const accessor descriptor, attrs: [___]), location: descriptor
    0x1ce500000dad: [String] in ReadOnlySpace: #prototype: 0x1ce500271bd5 <AccessorInfo name= 0x1ce500000dad <String[9]: #prototype>, data= 0x1ce500000069 <undefined>> (const accessor descriptor, attrs: [W__]), location: descriptor
 }
 - feedback vector: 0x1ce50029a0d5: [FeedbackVector] in OldSpace
 - map: 0x1ce5000007e1 <Map(FEEDBACK_VECTOR_TYPE)>
 - length: 4
 - shared function info: 0x1ce500299d2d <SharedFunctionInfo foo>
 - no optimized code
 - tiering state: TieringState::kInProgress
 - maybe has maglev code: 0
 - maybe has turbofan code: 0
 - invocation count: 1833
 - closure feedback cell array: 0x1ce5000020a5: [ClosureFeedbackCellArray] in ReadOnlySpace
 - map: 0x1ce5000007b9 <Map(CLOSURE_FEEDBACK_CELL_ARRAY_TYPE)>
 - length: 0
 - elements:

 - slot #0 LoadGlobalNotInsideTypeof MONOMORPHIC
   [weak] 0x1ce500299f9d <PropertyCell name=0x1ce500002af1 <String[1]: #a> value=0x1ce50004998d <JSArray[2]>> {
     [0]: [weak] 0x1ce500299f9d <PropertyCell name=0x1ce500002af1 <String[1]: #a> value=0x1ce50004998d <JSArray[2]>>
     [1]: 0x1ce500000e3d <Symbol: (uninitialized_symbol)>
  }
 - slot #2 LoadKeyed MONOMORPHIC
   [weak] 0x1ce50028d125 <Map[16](HOLEY_DOUBLE_ELEMENTS)>: LoadHandler(Smi)(kind = kElement, allow out of bounds = 0, is JSArray = 1, alow reading holes = 0, elements kind = HOLEY_DOUBLE_ELEMENTS) {
     [2]: [weak] 0x1ce50028d125 <Map[16](HOLEY_DOUBLE_ELEMENTS)>
     [3]: 5376
  }
0x1ce500281ea1: [Map] in OldSpace
 - map: 0x1ce5002816d9 <MetaMap (0x1ce500281729 <NativeContext[295]>)>
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
 - back pointer: 0x1ce500000069 <undefined>
 - prototype_validity cell: 0x1ce500000a89 <Cell value= 1>
 - instance descriptors (own) #5: 0x1ce500281ec9 <DescriptorArray[5]>
 - prototype: 0x1ce500281dc9 <JSFunction (sfi = 0x1ce5001474d1)>
 - constructor: 0x1ce500281e6d <JSFunction Function (sfi = 0x1ce500276e5d)>
 - dependent code: 0x1ce500000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0



```