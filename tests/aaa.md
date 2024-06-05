
- Shared function info: https://issues.chromium.org/issues/40931165

```js
// search -t dword 0x299cf1 anon_2eb00040
heap_addr: 0x228400000000
dummy addr: 0x22840004f154
======================================================================
DebugPrint: 0x22840029a005: [Function] in OldSpace
//...
 - shared_info: 0x228400299d59 <SharedFunctionInfo foo>
/// ==============================================

pwndbg> x/20wx 0x228400299d59-1
0x228400299d58:	0x00000d39	0x00400201	0xfffffffe	0x0029a0e1
0x228400299d68:	0x0029a119	0x00299989	0x0f020001	0x1002000c
0x228400299d78:	0x00001100	0x00000005	0x00000345	0x00000000
//...
pwndbg> job 0x228400299d59
0x228400299d59: [SharedFunctionInfo] in OldSpace
 - map: 0x228400000d39 <Map[48](SHARED_FUNCTION_INFO_TYPE)>
 - name: 0x228400299a85 <String[3]: #foo>
 - inferred name: 0x2284000000a1 <String[0]: #>
 - kind: NormalFunction
 - syntax kind: Declaration
 - function_map_index: 211
 - formal_parameter_count: 3841
 - expected_nof_properties: 2
 - language_mode: sloppy
 - function_data: -1
 - code (from function_data): 0x07b800080185 <Code BASELINE>
 - source code: (i) {
  a[i];
}




```