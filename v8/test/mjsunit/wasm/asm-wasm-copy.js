// Copyright 2016 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-wasm
// flags: r --expose-gc --allow-natives-syntax --trace-turbo --shell --turboshaft-wasm --sandbox-testing --expose-wasm

(function TestCopyBug() {
  // This was tickling a register allocation issue with
  // idiv in embenchen/copy.
  function asmModule(){
    'use asm';
    function func() {
      var ret = 0;
      var x = 1, y = 0, z = 0;
      var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
      do {
        y = (x + 0) | 0;
        z = (y | 0) % 2 | 0;
        ret = (y + z + a + b + c + d + e + f + g) | 0;
      } while(0);
      return ret | 0;
    }
    return { func: func };
  }
  var wasm = asmModule();
  /*
DebugPrint: 0x241c0004b19d: [JS_OBJECT_TYPE]
 - map: 0x241c0029a1dd <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x241c00282611 <Object map = 0x241c00281c25>
 - elements: 0x241c00000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x241c00000ed9 <PropertyArray[0]>
 - All own properties (excluding elements): {
    0x241c00299c69: [String] in OldSpace: #func: 0x241c0029a1bd <JSFunction js-to-wasm::i (sfi = 0x241c0029a18d)> (const data field 0, attrs: [WEC]), location: in-object
 }
0x241c0029a1dd: [Map] in OldSpace
 - map: 0x241c002816d9 <MetaMap (0x241c00281729 <NativeContext[295]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 28
 - inobject properties: 4
 - unused property fields: 3
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x241c00000069 <undefined>
 - prototype_validity cell: 0x241c00000a89 <Cell value= 1>
 - instance descriptors (own) #1: 0x241c0004b225 <DescriptorArray[1]>
 - prototype: 0x241c00282611 <Object map = 0x241c00281c25>
 - constructor: 0x241c00282139 <JSFunction Object (sfi = 0x241c0027652d)>
 - dependent code: 0x241c00000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

  */
  %DebugPrint(wasm);
  var js = eval('(' + asmModule.toString().replace('use asm', '') + ')')();
  console.log("===============================================================");
  %DebugPrint(js);
  /*
DebugPrint: 0x241c0004c0e5: [JS_OBJECT_TYPE]
 - map: 0x241c0029a4b5 <Map[16](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x241c00282611 <Object map = 0x241c00281c25>
 - elements: 0x241c00000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - properties: 0x241c00000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x241c00299c69: [String] in OldSpace: #func: 0x241c0004c0c5 <JSFunction func (sfi = 0x241c0029a3f1)> (const data field 0, attrs: [WEC]), location: in-object
 }
0x241c0029a4b5: [Map] in OldSpace
 - map: 0x241c002816d9 <MetaMap (0x241c00281729 <NativeContext[295]>)>
 - type: JS_OBJECT_TYPE
 - instance size: 16
 - inobject properties: 1
 - unused property fields: 0
 - elements kind: HOLEY_ELEMENTS
 - enum length: invalid
 - stable_map
 - back pointer: 0x241c0029a48d <Map[16](HOLEY_ELEMENTS)>
 - prototype_validity cell: 0x241c00000a89 <Cell value= 1>
 - instance descriptors (own) #1: 0x241c0004c0f5 <DescriptorArray[1]>
 - prototype: 0x241c00282611 <Object map = 0x241c00281c25>
 - constructor: 0x241c00282139 <JSFunction Object (sfi = 0x241c0027652d)>
 - dependent code: 0x241c00000735 <Other heap object (WEAK_ARRAY_LIST_TYPE)>
 - construction counter: 0

  */
  // //assertEquals(js.func(), wasm.func());
})();


/*
pwndbg> vmmap
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
             Start                End Perm     Size Offset File
     0x2b013e94000      0x2b013e96000 rwxp     2000      0 [anon_2b013e94]
    0x13e200000000     0x13e200001000 rw-p     1000      0 [anon_13e200000]
    0x13e200001000     0x13e200040000 ---p    3f000      0 [anon_13e200001]
    0x13e200040000     0x13e200080000 rw-p    40000      0 [anon_13e200040]
    0x13e200080000     0x13e240000000 ---p 3ff80000      0 [anon_13e200080]
    0x241400000000     0x241c00000000 ---p 800000000      0 [anon_241400000]
    0x241c00000000     0x241c00010000 r--p    10000      0 [anon_241c00000]
    0x241c00010000     0x241c00020000 ---p    10000      0 [anon_241c00010]
    0x241c00020000     0x241c00040000 r--p    20000      0 [anon_241c00020]
    0x241c00040000     0x241c00149000 rw-p   109000      0 [anon_241c00040]
    0x241c00149000     0x241c00180000 ---p    37000      0 [anon_241c00149]
    0x241c00180000     0x241c0027e000 r--p    fe000      0 [anon_241c00180]
    0x241c0027e000     0x241c00280000 ---p     2000      0 [anon_241c0027e]
    0x241c00280000     0x241c002c0000 rw-p    40000      0 [anon_241c00280]
    0x241c002c0000     0x252400000000 ---p 107ffd40000      0 [anon_241c002c0]
    0x39f7f4f17000     0x39f7f4f18000 r--p     1000      0 [anon_39f7f4f17]
    0x555555554000     0x55555558e000 r--p    3a000      0 /home/vult/Desktop/v8/v8/out/debug/d8
    0x55555558e000     0x5555555db000 r-xp    4d000  39000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555db000     0x5555555dd000 r--p     2000  85000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555dd000     0x5555555df000 rw-p     2000  86000 /home/vult/Desktop/v8/v8/out/debug/d8
    0x5555555df000     0x5555556ec000 rw-p   10d000      0 [heap]
    0x7ffef8000000     0x7ffef8010000 r--p    10000      0 [anon_7ffef8000]
    0x7ffef8010000     0x7fff00000000 ---p  7ff0000      0 [anon_7ffef8010]
    0x7fff00000000     0x7fff00010000 r--p    10000      0 [anon_7fff00000]
    0x7fff00010000     0x7fff00020000 rw-p    10000      0 [anon_7fff00010]
    0x7fff00020000     0x7fff20000000 ---p 1ffe0000      0 [anon_7fff00020]
    0x7fff20000000     0x7fff20010000 r--p    10000      0 [anon_7fff20000]
    0x7fff20010000     0x7fff40000000 ---p 1fff0000      0 [anon_7fff20010]
    0x7fff40000000     0x7fff40010000 r--p    10000      0 [anon_7fff40000]
    0x7fff40010000     0x7fff40030000 rw-p    20000      0 [anon_7fff40010]
    0x7fff40030000     0x7fff60000000 ---p 1ffd0000      0 [anon_7fff40030]
    0x7fff60000000     0x7fff7f480000 rwxp 1f480000      0 [anon_7fff60000]
    0x7fff7f480000     0x7fff7fff3000 r-xp   b73000 195d000 /home/vult/Desktop/v8/v8/out/debug/libv8.so
    0x7fff7fff3000     0x7fff80000000 rwxp     d000      0 [anon_7fff7fff3]
    0x7fff80000000     0x7fff80021000 rw-p    21000      0 [anon_7fff80000]
    0x7fff80021000     0x7fff84000000 ---p  3fdf000      0 [anon_7fff80021]
    0x7fff84000000     0x7fff84010000 r--p    10000      0 [anon_7fff84000]

*/