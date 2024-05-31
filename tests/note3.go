Instructions (size = 1396)
0x7fff60000600     0  488d1df9ffffff       REX.W leaq rbx,[rip+0xfffffff9]
0x7fff60000607     7  483bd9               REX.W cmpq rbx,rcx
0x7fff6000060a     a  740d                 jz 0x7fff60000619  <+0x19>
0x7fff6000060c     c  ba84000000           movl rdx,0x84
0x7fff60000611    11  41ff95a0540000       call [r13+0x54a0]
0x7fff60000618    18  cc                   int3l
0x7fff60000619    19  8b59f4               movl rbx,[rcx-0xc]
0x7fff6000061c    1c  490b9de0010000       REX.W orq rbx,[r13+0x1e0]
0x7fff60000623    23  f6431a20             testb [rbx+0x1a],0x20
0x7fff60000627    27  0f8593c84c1f         jnz 0x7fff7f4ccec0  (CompileLazyDeoptimizedCode)    ;; near builtin entry
0x7fff6000062d    2d  55                   push rbp
0x7fff6000062e    2e  4889e5               REX.W movq rbp,rsp
0x7fff60000631    31  56                   push rsi
0x7fff60000632    32  57                   push rdi
0x7fff60000633    33  50                   push rax
0x7fff60000634    34  4883ec40             REX.W subq rsp,0x40
0x7fff60000638    38  488975c8             REX.W movq [rbp-0x38],rsi
0x7fff6000063c    3c  493b65a0             REX.W cmpq rsp,[r13-0x60] (external value (StackGuard::address_of_jslimit()))
0x7fff60000640    40  0f8665040000         jna 0x7fff60000aab  <+0x4ab>
0x7fff60000646    46  48ba11970400db0c0000 REX.W movq rdx,0xcdb00049711    ;; object: 0x0cdb00049711 <Uint16Array map = 0xcdb0028d28d>
0x7fff60000650    50  8b4a13               movl rcx,[rdx+0x13]
0x7fff60000653    53  41baffffffff         movl r10,0xffffffff
0x7fff60000659    59  493bca               REX.W cmpq rcx,r10
0x7fff6000065c    5c  760d                 jna 0x7fff6000066b  <+0x6b>
0x7fff6000065e    5e  ba02000000           movl rdx,0x2
0x7fff60000663    63  41ff95a0540000       call [r13+0x54a0]
0x7fff6000066a    6a  cc                   int3l
0x7fff6000066b    6b  8b7a0f               movl rdi,[rdx+0xf]
0x7fff6000066e    6e  4903fe               REX.W addq rdi,r14
0x7fff60000671    71  448bc1               movl r8,rcx
0x7fff60000674    74  4183e002             andl r8,0x2
0x7fff60000678    78  48894db8             REX.W movq [rbp-0x48],rcx
0x7fff6000067c    7c  48897dc0             REX.W movq [rbp-0x40],rdi
0x7fff60000680    80  f6c101               testb rcx,0x1
0x7fff60000683    83  0f8553000000         jnz 0x7fff600006dc  <+0xdc>
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
0x7fff600006df    df  0f8559000000         jnz 0x7fff6000073e  <+0x13e>
0x7fff600006e5    e5  57                   push rdi
0x7fff600006e6    e6  48be559f2900db0c0000 REX.W movq rsi,0xcdb00299f55    ;; object: 0x0cdb00299f55 <ScriptContext[7]>
0x7fff600006f0    f0  48bb30ce38f6ff7f0000 REX.W movq rbx,0x7ffff638ce30    ;; external reference (Runtime::GrowableSharedArrayBufferByteLength)
0x7fff600006fa    fa  b801000000           movl rax,0x1
0x7fff600006ff    ff  e87c7a851f           call 0x7fff7f858180  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x7fff60000704   104  a801                 test al,0x1
0x7fff60000706   106  0f85c8030000         jnz 0x7fff60000ad4  <+0x4d4>
0x7fff6000070c   10c  d1f8                 sarl rax, 1
0x7fff6000070e   10e  c5832ac0             vcvtlsi2sd xmm0,xmm15,rax
0x7fff60000712   112  48ba11970400db0c0000 REX.W movq rdx,0xcdb00049711    ;; object: 0x0cdb00049711 <Uint16Array map = 0xcdb0028d28d>
/// ================================================================
0x7fff6000071c   11c  488b4a17             REX.W movq rcx,[rdx+0x17]
0x7fff60000720   120  48c1e91d             REX.W shrq rcx, 29
0x7fff60000724   124  c4e1fb2cf8           vcvttsd2siq rdi,xmm0
0x7fff60000729   129  482bf9               REX.W subq rdi,rcx // SUB underoverflow...
0x7fff6000072c   12c  48d1ef               REX.W shrq rdi, 1  //
0x7fff6000072f   12f  4c8bc7               REX.W movq r8,rdi  // r8 is length
0x7fff60000732   132  488b7dc0             REX.W movq rdi,[rbp-0x40]
0x7fff60000736   136  8b4db8               movl rcx,[rbp-0x48]
0x7fff60000739   139  e91f000000           jmp 0x7fff6000075d  <+0x15d>
// 0x7fff6000073e   13e  4c8b4713             REX.W movq r8,[rdi+0x13]
// 0x7fff60000742   142  49c1e81d             REX.W shrq r8, 29
// 0x7fff60000746   146  4c8b4a17             REX.W movq r9,[rdx+0x17]
// 0x7fff6000074a   14a  49c1e91d             REX.W shrq r9, 29
// 0x7fff6000074e   14e  4d3bc8               REX.W cmpq r9,r8
// 0x7fff60000751   151  0f8787030000         ja 0x7fff60000ade  <+0x4de>

// 0x7fff60000757   157  4d2bc1               REX.W subq r8,r9  
// 0x7fff6000075a   15a  49d1e8               REX.W shrq r8, 1
0x7fff6000075d   15d  41b901000000         movl r9,0x1
0x7fff60000763   163  448b5a37             movl r11,[rdx+0x37]
0x7fff60000767   167  41baffffffff         movl r10,0xffffffff
0x7fff6000076d   16d  4d3bda               REX.W cmpq r11,r10
0x7fff60000770   170  760d                 jna 0x7fff6000077f  <+0x17f>
// 0x7fff60000772   172  ba02000000           movl rdx,0x2
// 0x7fff60000777   177  41ff95a0540000       call [r13+0x54a0]
// 0x7fff6000077e   17e  cc                   int3l
0x7fff6000077f   17f  4c8b622f             REX.W movq r12,[rdx+0x2f]
0x7fff60000783   183  49c1ec18             REX.W shrq r12, 24
0x7fff60000787   187  4d03e6               REX.W addq r12,r14
0x7fff6000078a   18a  4c895dd0             REX.W movq [rbp-0x30],r11
0x7fff6000078e   18e  4c8b7d18             REX.W movq r15,[rbp+0x18]
0x7fff60000792   192  4c8965d8             REX.W movq [rbp-0x28],r12
0x7fff60000796   196  41f6c701             testb r15,0x1
0x7fff6000079a   19a  0f8546030000         jnz 0x7fff60000ae6  <+0x4e6>
0x7fff600007a0   1a0  498bc7               REX.W movq rax,r15
0x7fff600007a3   1a3  d1f8                 sarl rax, 1
0x7fff600007a5   1a5  4863c0               REX.W movsxlq rax,rax
0x7fff600007a8   1a8  493bc0               REX.W cmpq rax,r8 // cmp r8 = bytelength, rax is offset

/// ================================================================
0x7fff600007ab   1ab  0f83a5030000         jnc 0x7fff60000b56  <+0x556>
0x7fff600007b1   1b1  458bc3               movl r8,r11
0x7fff600007b4   1b4  41baffffffff         movl r10,0xffffffff
0x7fff600007ba   1ba  4d3bc2               REX.W cmpq r8,r10
0x7fff600007bd   1bd  760d                 jna 0x7fff600007cc  <+0x1cc>
0x7fff600007bf   1bf  ba02000000           movl rdx,0x2
0x7fff600007c4   1c4  41ff95a0540000       call [r13+0x54a0]
0x7fff600007cb   1cb  cc                   int3l
0x7fff600007cc   1cc  4d01e0               REX.W addq r8,r12
0x7fff600007cf   1cf  450fb70440           movzxwl r8,[r8+rax*2]
0x7fff600007d4   1d4  41baffffffff         movl r10,0xffffffff
0x7fff600007da   1da  4d3bc2               REX.W cmpq r8,r10
0x7fff600007dd   1dd  760d                 jna 0x7fff600007ec  <+0x1ec>
0x7fff600007df   1df  ba02000000           movl rdx,0x2
0x7fff600007e4   1e4  41ff95a0540000       call [r13+0x54a0]
0x7fff600007eb   1eb  cc                   int3l
0x7fff600007ec   1ec  488b5d20             REX.W movq rbx,[rbp+0x20]
0x7fff600007f0   1f0  f6c301               testb rbx,0x1
0x7fff600007f3   1f3  0f8561030000         jnz 0x7fff60000b5a  <+0x55a>
0x7fff600007f9   1f9  488bf3               REX.W movq rsi,rbx
0x7fff600007fc   1fc  d1fe                 sarl rsi, 1
0x7fff600007fe   1fe  488945e0             REX.W movq [rbp-0x20],rax
0x7fff60000802   202  4c8945a8             REX.W movq [rbp-0x58],r8
0x7fff60000806   206  488975b0             REX.W movq [rbp-0x50],rsi
0x7fff6000080a   20a  4585c9               testl r9,r9
0x7fff6000080d   20d  0f854d000000         jnz 0x7fff60000860  <+0x260>
0x7fff60000813   213  f6c102               testb rcx,0x2
0x7fff60000816   216  0f850d000000         jnz 0x7fff60000829  <+0x229>
0x7fff6000081c   21c  4c8b4a27             REX.W movq r9,[rdx+0x27]
0x7fff60000820   220  49c1e91d             REX.W shrq r9, 29
0x7fff60000824   224  e9d3000000           jmp 0x7fff600008fc  <+0x2fc>
0x7fff60000829   229  4c8b4a1f             REX.W movq r9,[rdx+0x1f]
0x7fff6000082d   22d  49c1e91d             REX.W shrq r9, 29
0x7fff60000831   231  4c8b4713             REX.W movq r8,[rdi+0x13]
0x7fff60000835   235  49c1e81d             REX.W shrq r8, 29
0x7fff60000839   239  488b7a17             REX.W movq rdi,[rdx+0x17]
0x7fff6000083d   23d  48c1ef1d             REX.W shrq rdi, 29
0x7fff60000841   241  4903f9               REX.W addq rdi,r9
0x7fff60000844   244  493bf8               REX.W cmpq rdi,r8
0x7fff60000847   247  0f8603000000         jna 0x7fff60000850  <+0x250>
0x7fff6000084d   24d  4533c9               xorl r9,r9
0x7fff60000850   250  49d1e9               REX.W shrq r9, 1
0x7fff60000853   253  4c8b45a8             REX.W movq r8,[rbp-0x58]
0x7fff60000857   257  488b7dc0             REX.W movq rdi,[rbp-0x40]
0x7fff6000085b   25b  e99c000000           jmp 0x7fff600008fc  <+0x2fc>
0x7fff60000860   260  f6c102               testb rcx,0x2
0x7fff60000863   263  0f8570000000         jnz 0x7fff600008d9  <+0x2d9>
0x7fff60000869   269  57                   push rdi
0x7fff6000086a   26a  48be559f2900db0c0000 REX.W movq rsi,0xcdb00299f55    ;; object: 0x0cdb00299f55 <ScriptContext[7]>
0x7fff60000874   274  488b1d77feffff       REX.W movq rbx,[rip+0xfffffe77]
0x7fff6000087b   27b  b801000000           movl rax,0x1
0x7fff60000880   280  4c8bcb               REX.W movq r9,rbx
0x7fff60000883   283  e8f878851f           call 0x7fff7f858180  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x7fff60000888   288  a801                 test al,0x1
0x7fff6000088a   28a  0f85a2020000         jnz 0x7fff60000b32  <+0x532>
0x7fff60000890   290  d1f8                 sarl rax, 1
0x7fff60000892   292  c5832ac0             vcvtlsi2sd xmm0,xmm15,rax
0x7fff60000896   296  48ba11970400db0c0000 REX.W movq rdx,0xcdb00049711    ;; object: 0x0cdb00049711 <Uint16Array map = 0xcdb0028d28d>
0x7fff600008a0   2a0  488b4a17             REX.W movq rcx,[rdx+0x17]
0x7fff600008a4   2a4  48c1e91d             REX.W shrq rcx, 29
0x7fff600008a8   2a8  c4e1fb2cf8           vcvttsd2siq rdi,xmm0
0x7fff600008ad   2ad  482bf9               REX.W subq rdi,rcx
0x7fff600008b0   2b0  48d1ef               REX.W shrq rdi, 1
0x7fff600008b3   2b3  4c8bcf               REX.W movq r9,rdi
0x7fff600008b6   2b6  488b45e0             REX.W movq rax,[rbp-0x20]
0x7fff600008ba   2ba  4c8b65d8             REX.W movq r12,[rbp-0x28]
0x7fff600008be   2be  448b5dd0             movl r11,[rbp-0x30]
0x7fff600008c2   2c2  488b5d20             REX.W movq rbx,[rbp+0x20]
0x7fff600008c6   2c6  488b7dc0             REX.W movq rdi,[rbp-0x40]
0x7fff600008ca   2ca  8b4db8               movl rcx,[rbp-0x48]
0x7fff600008cd   2cd  8b75b0               movl rsi,[rbp-0x50]
0x7fff600008d0   2d0  4c8b45a8             REX.W movq r8,[rbp-0x58]
0x7fff600008d4   2d4  e91f000000           jmp 0x7fff600008f8  <+0x2f8>
0x7fff600008d9   2d9  4c8b4f13             REX.W movq r9,[rdi+0x13]
0x7fff600008dd   2dd  49c1e91d             REX.W shrq r9, 29
0x7fff600008e1   2e1  4c8b7a17             REX.W movq r15,[rdx+0x17]
0x7fff600008e5   2e5  49c1ef1d             REX.W shrq r15, 29
0x7fff600008e9   2e9  4d3bf9               REX.W cmpq r15,r9
0x7fff600008ec   2ec  0f874a020000         ja 0x7fff60000b3c  <+0x53c>
0x7fff600008f2   2f2  4d2bcf               REX.W subq r9,r15
0x7fff600008f5   2f5  49d1e9               REX.W shrq r9, 1
0x7fff600008f8   2f8  4c8b7d18             REX.W movq r15,[rbp+0x18]
0x7fff600008fc   2fc  493bc1               REX.W cmpq rax,r9
0x7fff600008ff   2ff  0f8359020000         jnc 0x7fff60000b5e  <+0x55e>
0x7fff60000905   305  4d8bc8               REX.W movq r9,r8
0x7fff60000908   308  448bc6               movl r8,rsi
0x7fff6000090b   30b  4503c1               addl r8,r9
0x7fff6000090e   30e  41baffffffff         movl r10,0xffffffff
0x7fff60000914   314  4d3bc2               REX.W cmpq r8,r10
0x7fff60000917   317  760d                 jna 0x7fff60000926  <+0x326>
0x7fff60000919   319  ba02000000           movl rdx,0x2
0x7fff6000091e   31e  41ff95a0540000       call [r13+0x54a0]
0x7fff60000925   325  cc                   int3l
0x7fff60000926   326  458bcb               movl r9,r11
0x7fff60000929   329  41baffffffff         movl r10,0xffffffff
0x7fff6000092f   32f  4d3bca               REX.W cmpq r9,r10
0x7fff60000932   332  760d                 jna 0x7fff60000941  <+0x341>
0x7fff60000934   334  ba02000000           movl rdx,0x2
0x7fff60000939   339  41ff95a0540000       call [r13+0x54a0]
0x7fff60000940   340  cc                   int3l
0x7fff60000941   341  4d01e1               REX.W addq r9,r12
0x7fff60000944   344  6645890441           movw [r9+rax*2],r8
0x7fff60000949   349  f6c101               testb rcx,0x1
0x7fff6000094c   34c  0f8550000000         jnz 0x7fff600009a2  <+0x3a2>
0x7fff60000952   352  f6c102               testb rcx,0x2
0x7fff60000955   355  0f850d000000         jnz 0x7fff60000968  <+0x368>
0x7fff6000095b   35b  488b4a27             REX.W movq rcx,[rdx+0x27]
0x7fff6000095f   35f  48c1e91d             REX.W shrq rcx, 29
0x7fff60000963   363  e9c8000000           jmp 0x7fff60000a30  <+0x430>
0x7fff60000968   368  488b4a1f             REX.W movq rcx,[rdx+0x1f]
0x7fff6000096c   36c  48c1e91d             REX.W shrq rcx, 29
0x7fff60000970   370  488b7f13             REX.W movq rdi,[rdi+0x13]
0x7fff60000974   374  48c1ef1d             REX.W shrq rdi, 29
0x7fff60000978   378  4c8b4217             REX.W movq r8,[rdx+0x17]
0x7fff6000097c   37c  49c1e81d             REX.W shrq r8, 29
0x7fff60000980   380  4c03c1               REX.W addq r8,rcx
0x7fff60000983   383  4c3bc7               REX.W cmpq r8,rdi
0x7fff60000986   386  0f8608000000         jna 0x7fff60000994  <+0x394>
0x7fff6000098c   38c  4533c9               xorl r9,r9
0x7fff6000098f   38f  e903000000           jmp 0x7fff60000997  <+0x397>
0x7fff60000994   394  4c8bc9               REX.W movq r9,rcx
0x7fff60000997   397  49d1e9               REX.W shrq r9, 1
0x7fff6000099a   39a  498bc9               REX.W movq rcx,r9
0x7fff6000099d   39d  e98e000000           jmp 0x7fff60000a30  <+0x430>
0x7fff600009a2   3a2  f6c102               testb rcx,0x2
0x7fff600009a5   3a5  0f8566000000         jnz 0x7fff60000a11  <+0x411>
0x7fff600009ab   3ab  57                   push rdi
0x7fff600009ac   3ac  488b0d3ffdffff       REX.W movq rcx,[rip+0xfffffd3f]
0x7fff600009b3   3b3  48be559f2900db0c0000 REX.W movq rsi,0xcdb00299f55    ;; object: 0x0cdb00299f55 <ScriptContext[7]>
0x7fff600009bd   3bd  b801000000           movl rax,0x1
0x7fff600009c2   3c2  488bd9               REX.W movq rbx,rcx
0x7fff600009c5   3c5  e8b677851f           call 0x7fff7f858180  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x7fff600009ca   3ca  a801                 test al,0x1
0x7fff600009cc   3cc  0f8572010000         jnz 0x7fff60000b44  <+0x544>
0x7fff600009d2   3d2  d1f8                 sarl rax, 1
0x7fff600009d4   3d4  c5832ac0             vcvtlsi2sd xmm0,xmm15,rax
0x7fff600009d8   3d8  48ba11970400db0c0000 REX.W movq rdx,0xcdb00049711    ;; object: 0x0cdb00049711 <Uint16Array map = 0xcdb0028d28d>
0x7fff600009e2   3e2  488b4a17             REX.W movq rcx,[rdx+0x17]
0x7fff600009e6   3e6  48c1e91d             REX.W shrq rcx, 29
0x7fff600009ea   3ea  c4e1fb2cf8           vcvttsd2siq rdi,xmm0
0x7fff600009ef   3ef  482bf9               REX.W subq rdi,rcx
0x7fff600009f2   3f2  48d1ef               REX.W shrq rdi, 1
0x7fff600009f5   3f5  488bcf               REX.W movq rcx,rdi
0x7fff600009f8   3f8  488b45e0             REX.W movq rax,[rbp-0x20]
0x7fff600009fc   3fc  4c8b65d8             REX.W movq r12,[rbp-0x28]
0x7fff60000a00   400  448b5dd0             movl r11,[rbp-0x30]
0x7fff60000a04   404  4c8b7d18             REX.W movq r15,[rbp+0x18]
0x7fff60000a08   408  488b5d20             REX.W movq rbx,[rbp+0x20]
0x7fff60000a0c   40c  e91f000000           jmp 0x7fff60000a30  <+0x430>
0x7fff60000a11   411  488b4f13             REX.W movq rcx,[rdi+0x13]
0x7fff60000a15   415  48c1e91d             REX.W shrq rcx, 29
0x7fff60000a19   419  488b7a17             REX.W movq rdi,[rdx+0x17]
0x7fff60000a1d   41d  48c1ef1d             REX.W shrq rdi, 29
0x7fff60000a21   421  483bf9               REX.W cmpq rdi,rcx
0x7fff60000a24   424  0f8724010000         ja 0x7fff60000b4e  <+0x54e>
0x7fff60000a2a   42a  482bcf               REX.W subq rcx,rdi
0x7fff60000a2d   42d  48d1e9               REX.W shrq rcx, 1
0x7fff60000a30   430  483bc1               REX.W cmpq rax,rcx
0x7fff60000a33   433  0f8329010000         jnc 0x7fff60000b62  <+0x562>
0x7fff60000a39   439  418bcb               movl rcx,r11
0x7fff60000a3c   43c  41baffffffff         movl r10,0xffffffff
0x7fff60000a42   442  493bca               REX.W cmpq rcx,r10
0x7fff60000a45   445  760d                 jna 0x7fff60000a54  <+0x454>
0x7fff60000a47   447  ba02000000           movl rdx,0x2
0x7fff60000a4c   44c  41ff95a0540000       call [r13+0x54a0]
0x7fff60000a53   453  cc                   int3l
0x7fff60000a54   454  4c89e7               REX.W movq rdi,r12
0x7fff60000a57   457  4803cf               REX.W addq rcx,rdi
0x7fff60000a5a   45a  0fb70c41             movzxwl rcx,[rcx+rax*2]
0x7fff60000a5e   45e  41baffffffff         movl r10,0xffffffff
0x7fff60000a64   464  493bca               REX.W cmpq rcx,r10
0x7fff60000a67   467  760d                 jna 0x7fff60000a76  <+0x476>
0x7fff60000a69   469  ba02000000           movl rdx,0x2
0x7fff60000a6e   46e  41ff95a0540000       call [r13+0x54a0]
0x7fff60000a75   475  cc                   int3l
0x7fff60000a76   476  8d0409               leal rax,[rcx+rcx*1]
0x7fff60000a79   479  41baffffffff         movl r10,0xffffffff
0x7fff60000a7f   47f  493bc2               REX.W cmpq rax,r10
0x7fff60000a82   482  760d                 jna 0x7fff60000a91  <+0x491>
0x7fff60000a84   484  ba02000000           movl rdx,0x2
0x7fff60000a89   489  41ff95a0540000       call [r13+0x54a0]
0x7fff60000a90   490  cc                   int3l
0x7fff60000a91   491  488b4de8             REX.W movq rcx,[rbp-0x18]
0x7fff60000a95   495  488be5               REX.W movq rsp,rbp
0x7fff60000a98   498  5d                   pop rbp
0x7fff60000a99   499  4883f903             REX.W cmpq rcx,0x3
0x7fff60000a9d   49d  7f03                 jg 0x7fff60000aa2  <+0x4a2>
0x7fff60000a9f   49f  c21800               ret 0x18
0x7fff60000aa2   4a2  415a                 pop r10
0x7fff60000aa4   4a4  488d24cc             REX.W leaq rsp,[rsp+rcx*8]
0x7fff60000aa8   4a8  4152                 push r10
0x7fff60000aaa   4aa  c3                   retl
0x7fff60000aab   4ab  ba00010000           movl rdx,0x100
0x7fff60000ab0   4b0  52                   push rdx
0x7fff60000ab1   4b1  b801000000           movl rax,0x1
0x7fff60000ab6   4b6  48bb80942df6ff7f0000 REX.W movq rbx,0x7ffff62d9480    ;; external reference (Runtime::StackGuardWithGap)
0x7fff60000ac0   4c0  48be29172800db0c0000 REX.W movq rsi,0xcdb00281729    ;; object: 0x0cdb00281729 <NativeContext[295]>
0x7fff60000aca   4ca  e8b176851f           call 0x7fff7f858180  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x7fff60000acf   4cf  e972fbffff           jmp 0x7fff60000646  <+0x46>
0x7fff60000ad4   4d4  c5fb104003           vmovsd xmm0,[rax+0x3]
0x7fff60000ad9   4d9  e934fcffff           jmp 0x7fff60000712  <+0x112>
0x7fff60000ade   4de  4533c0               xorl r8,r8
0x7fff60000ae1   4e1  e977fcffff           jmp 0x7fff6000075d  <+0x15d>

/// ================================================================
0x7fff60000ae6   4e6  418b47ff             movl rax,[r15-0x1]
0x7fff60000aea   4ea  41baffffffff         movl r10,0xffffffff
0x7fff60000af0   4f0  493bc2               REX.W cmpq rax,r10
0x7fff60000af3   4f3  760d                 jna 0x7fff60000b02  <+0x502>
0x7fff60000af5   4f5  ba02000000           movl rdx,0x2
0x7fff60000afa   4fa  41ff95a0540000       call [r13+0x54a0]
0x7fff60000b01   501  cc                   int3l
0x7fff60000b02   502  3d09080000           cmp rax,0x809
0x7fff60000b07   507  0f8559000000         jnz 0x7fff60000b66  <+0x566>
0x7fff60000b0d   50d  c4c17b104703         vmovsd xmm0,[r15+0x3]
0x7fff60000b13   513  c4e1fb2cc0           vcvttsd2siq rax,xmm0
0x7fff60000b18   518  c4e1832ac8           vcvtqsi2sd xmm1,xmm15,rax
0x7fff60000b1d   51d  c5f92ec1             vucomisd xmm0,xmm1
0x7fff60000b21   521  0f8a43000000         jpe 0x7fff60000b6a  <+0x56a>
0x7fff60000b27   527  0f853d000000         jnz 0x7fff60000b6a  <+0x56a>
0x7fff60000b2d   52d  e976fcffff           jmp 0x7fff600007a8  <+0x1a8>
0x7fff60000b32   532  c5fb104003           vmovsd xmm0,[rax+0x3]
0x7fff60000b37   537  e95afdffff           jmp 0x7fff60000896  <+0x296>
0x7fff60000b3c   53c  4533c9               xorl r9,r9
0x7fff60000b3f   53f  e9b4fdffff           jmp 0x7fff600008f8  <+0x2f8>
0x7fff60000b44   544  c5fb104003           vmovsd xmm0,[rax+0x3]
0x7fff60000b49   549  e98afeffff           jmp 0x7fff600009d8  <+0x3d8>
0x7fff60000b4e   54e  33c9                 xorl rcx,rcx
0x7fff60000b50   550  e9dbfeffff           jmp 0x7fff60000a30  <+0x430>
0x7fff60000b55   555  90                   nop
0x7fff60000b56   556  41ff55d0             call [r13-0x30]    ;; debug: deopt position, script offset '238'
                                                             ;; debug: deopt position, inlining id '0'
                                                             ;; debug: deopt reason 'out of bounds'
                                                             ;; debug: deopt index 0
                                                             ;; debug: deopt node id 88

/// ================================================================

byte_offset_ofs: 4972b
byte_offset: 0
After writing, byte_offset: 4141414100000000
DebugPrint: 0x1e3200049715: [JSTypedArray]
 - map: 0x1e320028d28d <Map[76](RAB_GSAB_UINT16ELEMENTS)> [FastProperties]
 - prototype: 0x1e3200288ebd <Object map = 0x1e3200288e51>
 - elements: 0x1e3200000ec1 <ByteArray[0]> [RAB_GSAB_UINT16ELEMENTS]
 - embedder fields: 2
 - cpp_heap_wrappable: 0
 - buffer: 0x1e32000496d1 <SharedArrayBuffer map = 0x1e3200291375>
 - byte_offset: 34212362
 - byte_length: 0
 - length: 0
 - data_ptr: 0x1e3500000000
   - base_pointer: (nil)
   - external_pointer: 0x1e3500000000
 - length-tracking
 - properties: 0x1e3200000725 <FixedArray[0]>
 - All own properties (excluding elements): {}
 - embedder fields = {
    0, aligned pointer: (nil)
    0, aligned pointer: (nil)
 }
0x1e320028d28d: [Map] in OldSpace
 - map: 0x1e32002816d9 <MetaMap (0x1e3200281729 <NativeContext[295]>)>
 - type: JS_TYPED_ARRAY_TYPE
 - instance size: 76
 - inobject properties: 0
 - unused property fields: 0
 - elements kind: RAB_GSAB_UINT16ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x1e3200000069 <undefined>
 - prototype_validity cell: 0x1e3200000a89 <Cell value= 1>
 - instance descriptors (own) #0: 0x1e3200000759 <DescriptorArray[0]>
 - prototype: 0x1e3200288ebd <Object map = 0x1e3200288e51>
 - constructor: 0x1e3200288df5 <JSFunction Uint16Array (sfi = 0x1e320027c25d)>
 - dependent code: 0x1e3200049799 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0