
# Table of Content


# Builtins

- https://source.chromium.org/chromium/chromium/src/+/main:v8/src/builtins/

Call `Builtins_WebAssemblyStringFromUtf8Array`

```js
Thread 1 "d8" hit Breakpoint 1, 0x0000555556ae74d3 in Builtins_CallFunction_ReceiverIsAny ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x1
 RBX  0x0
*RCX  0x16690
*RDX  0x25de00000069 ◂— 0x4
*RDI  0x25de001b08c1 ◂— 0x2500000725001923
*RSI  0x25de00181729 ◂— 0x450000024e001817
*R8   0x25de00199df1 ◂— 0x5900000040001902
 R9   0x4f5
 R10  0x7fff98000000 ◂— 0x0
 R11  0x0
*R12  0x246300040169 ◂— 0x1600400200000009 /* '\t' */
 R13  0x555556fa6080 —▸ 0x555556ae6f00 (Builtins_AdaptorWithBuiltinExitFrame) ◂— mov ecx, dword ptr [rdi + 0xf]
*R14  0x25de00000000 ◂— 0x40940
*R15  0x555556fdd670 —▸ 0x555556c751c0 (Builtins_WideHandler) ◂— add r9, 1
*RBP  0x7fffffffd610 —▸ 0x7fffffffd638 —▸ 0x7fffffffd6b0 —▸ 0x7fffffffd810 —▸ 0x7fffffffd880 ◂— ...
*RSP  0x7fffffffd588 —▸ 0x555556af2ca7 (Builtins_InterpreterEntryTrampoline+295) ◂— mov r12, qword ptr [rbp - 0x20]
*RIP  0x555556ae74d3 (Builtins_CallFunction_ReceiverIsAny+275) ◂— mov rcx, qword ptr [r10 + rcx]
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
 ► 0x555556ae74d3 <Builtins_CallFunction_ReceiverIsAny+275>       mov    rcx, qword ptr [r10 + rcx]
   0x555556ae74d7 <Builtins_CallFunction_ReceiverIsAny+279>       jmp    rcx
    ↓
   0x555556c6cf40 <Builtins_WebAssemblyStringFromUtf8Array>       push   rbp
   0x555556c6cf41 <Builtins_WebAssemblyStringFromUtf8Array+1>     mov    rbp, rsp
   0x555556c6cf44 <Builtins_WebAssemblyStringFromUtf8Array+4>     push   rsi
   0x555556c6cf45 <Builtins_WebAssemblyStringFromUtf8Array+5>     push   rdi
   0x555556c6cf46 <Builtins_WebAssemblyStringFromUtf8Array+6>     push   rax
   0x555556c6cf47 <Builtins_WebAssemblyStringFromUtf8Array+7>     sub    rsp, 0x28
   0x555556c6cf4b <Builtins_WebAssemblyStringFromUtf8Array+11>    mov    qword ptr [rbp - 0x38], rsi
   0x555556c6cf4f <Builtins_WebAssemblyStringFromUtf8Array+15>    cmp    rsp, qword ptr [r13 - 0x60]
   0x555556c6cf53 <Builtins_WebAssemblyStringFromUtf8Array+19>    jbe    Builtins_WebAssemblyStringFromUtf8Array+240                <Builtins_WebAssemblyStringFromUtf8Array+240>

```

Before calling function

```js
// ================================================================================
Thread 1 "d8" hit Breakpoint 1, 0x0000555556ae74d3 in Builtins_CallFunction_ReceiverIsAny ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
*RAX  0x1
 RBX  0x0
*RCX  0x16690
*RDX  0x3e0e00000069 ◂— 0x4
*RDI  0x3e0e001b0e05 ◂— 0x2500000725001923
*RSI  0x3e0e00181729 ◂— 0x450000024e001817
*R8   0x7fffffffd578 —▸ 0x3e0e00000069 ◂— 0x4
*R9   0x2
*R10  0x7fff98000000 ◂— 0x0
*R11  0x2
*R12  0x192800040191 ◂— 0xa200400200000009 /* '\t' */
*R13  0x555556fa6080 —▸ 0x555556ae6f00 (Builtins_AdaptorWithBuiltinExitFrame) ◂— mov ecx, dword ptr [rdi + 0xf]
*R14  0x3e0e00000000 ◂— 0x40940
*R15  0x555556fdd670 —▸ 0x555556c751c0 (Builtins_WideHandler) ◂— add r9, 1
*RBP  0x7fffffffd610 —▸ 0x7fffffffd638 —▸ 0x7fffffffd6b0 —▸ 0x7fffffffd810 —▸ 0x7fffffffd880 ◂— ...
*RSP  0x7fffffffd568 —▸ 0x555556af2ca7 (Builtins_InterpreterEntryTrampoline+295) ◂— mov r12, qword ptr [rbp - 0x20]
*RIP  0x555556ae74d3 (Builtins_CallFunction_ReceiverIsAny+275) ◂— mov rcx, qword ptr [r10 + rcx]
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
 ► 0x555556ae74d3 <Builtins_CallFunction_ReceiverIsAny+275>       mov    rcx, qword ptr [r10 + rcx]
   0x555556ae74d7 <Builtins_CallFunction_ReceiverIsAny+279>       jmp    rcx

// ================================================================================
pwndbg> 
0x0000555556ae74d7 in Builtins_CallFunction_ReceiverIsAny ()
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
──────────────────────────────────────────────────────────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]───────────────────────────────────────────────────────────────────────────────
 RAX  0x2
 RBX  0x0
*RCX  0x555556c5f080 (Builtins_JSToJSWrapper) ◂— push rbp
 RDX  0x328e00000069 ◂— 0x4
 RDI  0x328e001dccfd ◂— 0x2500000725001923
 RSI  0x328e00181729 ◂— 0x450000024e001817
 R8   0x328e00199cd9 ◂— 0x3d0000001a001902
 R9   0xfffffffffffffff7
 R10  0x7fff98000000 ◂— 0x0
 R11  0xd2
 R12  0x209300000629 ◂— 0x8c00400200000009 /* '\t' */
 R13  0x555556fa6080 —▸ 0x555556ae6f00 (Builtins_AdaptorWithBuiltinExitFrame) ◂— mov ecx, dword ptr [rdi + 0xf]
 R14  0x328e00000000 ◂— 0x40940
 R15  0x4f5
 RBP  0x7fffffffd620 —▸ 0x7fffffffd648 —▸ 0x7fffffffd6c0 —▸ 0x7fffffffd820 —▸ 0x7fffffffd890 ◂— ...
 RSP  0x7fffffffd590 —▸ 0x555556af2ca7 (Builtins_InterpreterEntryTrampoline+295) ◂— mov r12, qword ptr [rbp - 0x20]
*RIP  0x555556ae74d7 (Builtins_CallFunction_ReceiverIsAny+279) ◂— jmp rcx
───────────────────────────────────────────────────────────────────────────────────────[ DISASM / x86-64 / set emulate on ]────────────────────────────────────────────────────────────────────────────────────────
   0x555556ae74cd <Builtins_CallFunction_ReceiverIsAny+269>    shr    ecx, 9
   0x555556ae74d0 <Builtins_CallFunction_ReceiverIsAny+272>    shl    ecx, 4
   0x555556ae74d3 <Builtins_CallFunction_ReceiverIsAny+275>    mov    rcx, qword ptr [r10 + rcx]
 ► 0x555556ae74d7 <Builtins_CallFunction_ReceiverIsAny+279>    jmp    rcx   
```