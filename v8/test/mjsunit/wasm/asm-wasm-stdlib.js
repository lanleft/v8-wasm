// Copyright 2016 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --validate-asm --allow-natives-syntax
// flags: r --expose-gc --allow-natives-syntax --sandbox-testing --validate-asm --shell

var stdlib = this;

function assertValidAsm(func) {
  //assertTrue(%IsAsmWasmCode(func));
}

(function TestStdlibConstants() {
  function Module(stdlib) {
    "use asm";

    var StdlibInfinity = stdlib.Infinity;
    var StdlibNaN = stdlib.NaN;
    var StdlibMathE = stdlib.Math.E;
    var StdlibMathLN10 = stdlib.Math.LN10;
    var StdlibMathLN2 = stdlib.Math.LN2;
    var StdlibMathLOG2E = stdlib.Math.LOG2E;
    var StdlibMathLOG10E = stdlib.Math.LOG10E;
    var StdlibMathPI = stdlib.Math.PI;
    var StdlibMathSQRT1_2 = stdlib.Math.SQRT1_2;
    var StdlibMathSQRT2 = stdlib.Math.SQRT2;

    function caller() {
      if (StdlibInfinity != 1.0 / 0.0) return 0;
      if (StdlibMathE != 2.718281828459045) return 0;
      if (StdlibMathLN10 != 2.302585092994046) return 0;
      if (StdlibMathLN2 != 0.6931471805599453) return 0;
      if (StdlibMathLOG2E != 1.4426950408889634) return 0;
      if (StdlibMathLOG10E != 0.4342944819032518) return 0;
      if (StdlibMathPI != 3.141592653589793) return 0;
      if (StdlibMathSQRT1_2 != 0.7071067811865476) return 0;
      if (StdlibMathSQRT2 != 1.4142135623730951) return 0;
      return 1;
    }

    function nanCheck() {
      return +StdlibNaN;
    }

    return {caller:caller, nanCheck:nanCheck};
  }

  var m = Module(stdlib);
  //assertValidAsm(Module);
  ////assertEquals(1, m.caller());
  //assertTrue(isNaN(m.nanCheck()));
})();


var stdlib = this;
var stdlib_root_members = [
  'Infinity',
  'NaN',
];
var stdlib_math_members = [
  'E',
  'LN10',
  'LN2',
  'LOG2E',
  'LOG10E',
  'PI',
  'SQRT1_2',
  'SQRT2',
  'ceil',
  'clz32',
  'floor',
  'sqrt',
  'abs',
  'min',
  'max',
  'acos',
  'asin',
  'atan',
  'cos',
  'sin',
  'tan',
  'exp',
  'log',
  'atan2',
  'pow',
  'imul',
  'fround',
];


(function TestBadStdlib() {
  function Module(stdlib) {
    "use asm";
    var foo = stdlib.NaN;
    return {};
  }
  for (var i = 0; i < stdlib_root_members.length; ++i) {
    var member = stdlib_root_members[i];
    var stdlib = {};
    stdlib[member] = 0;
    print(member);
    var code = Module.toString().replace('NaN', member);
    var decl = eval('(' + code + ')');
    decl(stdlib);
    //assertFalse(%IsAsmWasmCode(decl));
  }
  for (var i = 0; i < stdlib_math_members.length; ++i) {
    var member = stdlib_math_members[i];
    var stdlib = {Math:{}};
    stdlib['Math'][member] = 0;
    print(member);
    var code = Module.toString().replace('NaN', 'Math.' + member);
    var decl = eval('(' + code + ')');
    decl(stdlib);
    //assertFalse(%IsAsmWasmCode(decl));
  }
})();


(function TestMissingNaNStdlib() {
  function Module(stdlib) {
    "use asm";
    var foo = stdlib.NaN;
    return {};
  }
  for (var i = 0; i < stdlib_root_members.length; ++i) {
    var member = stdlib_root_members[i];
    var code = Module.toString().replace('NaN', member);
    var decl = eval('(' + code + ')');
    decl({});
    //assertFalse(%IsAsmWasmCode(decl));
  }
  for (var i = 0; i < stdlib_math_members.length; ++i) {
    var member = stdlib_math_members[i];
    var code = Module.toString().replace('NaN', 'Math.' + member);
    var decl = eval('(' + code + ')');
    // assertThrows(function() {
    //   decl({});
    //   //assertFalse(%IsAsmWasmCode(decl));
    // });
  }
})();


(function TestStdlibFunctionsInside() {
  function Module(stdlib) {
    "use asm";

    var StdlibMathCeil = stdlib.Math.ceil;
    var StdlibMathClz32 = stdlib.Math.clz32;
    var StdlibMathFloor = stdlib.Math.floor;
    var StdlibMathSqrt = stdlib.Math.sqrt;
    var StdlibMathAbs = stdlib.Math.abs;
    var StdlibMathMin = stdlib.Math.min;
    var StdlibMathMax = stdlib.Math.max;

    var StdlibMathAcos = stdlib.Math.acos;
    var StdlibMathAsin = stdlib.Math.asin;
    var StdlibMathAtan = stdlib.Math.atan;
    var StdlibMathCos = stdlib.Math.cos;
    var StdlibMathSin = stdlib.Math.sin;
    var StdlibMathTan = stdlib.Math.tan;
    var StdlibMathExp = stdlib.Math.exp;
    var StdlibMathLog = stdlib.Math.log;

    var StdlibMathAtan2 = stdlib.Math.atan2;
    var StdlibMathPow = stdlib.Math.pow;
    var StdlibMathImul = stdlib.Math.imul;

    var fround = stdlib.Math.fround;

    function deltaEqual(x, y) {
      x = +x;
      y = +y;
      var t = 0.0;
      t = x - y;
      if (t < 0.0) {
        t = t * -1.0;
      }
      return (t < 1.0e-13) | 0;
    }

    function caller() {
      if (!(deltaEqual(+StdlibMathSqrt(123.0), 11.090536506409418)|0)) return 0;
      if (fround(StdlibMathSqrt(fround(256.0))) != fround(16.0)) return 0;
      if (+StdlibMathCeil(123.7) != 124.0) return 0;
      if (fround(StdlibMathCeil(fround(123.7))) != fround(124.0)) return 0;
      if (+StdlibMathFloor(123.7) != 123.0) return 0;
      if (fround(StdlibMathFloor(fround(123.7))) != fround(123.0)) return 0;
      if (+StdlibMathAbs(-123.0) != 123.0) return 0;
      if (fround(StdlibMathAbs(fround(-123.0))) != fround(123.0)) return 0;
      if (+StdlibMathMin(123.4, 1236.4) != 123.4) return 0;
      if (fround(StdlibMathMin(fround(123.4),
            fround(1236.4))) != fround(123.4)) return 0;
      if (+StdlibMathMax(123.4, 1236.4) != 1236.4) return 0;
      if (fround(StdlibMathMax(fround(123.4), fround(1236.4)))
          != fround(1236.4)) return 0;

      if (!(deltaEqual(+StdlibMathAcos(0.1), 1.4706289056333368)|0)) return 0;
      if (!(deltaEqual(+StdlibMathAsin(0.2), 0.2013579207903308)|0)) return 0;
      if (!(deltaEqual(+StdlibMathAtan(0.2), 0.19739555984988078)|0)) return 0;
      if (!(deltaEqual(+StdlibMathCos(0.2), 0.9800665778412416)|0)) return 0;
      if (!(deltaEqual(+StdlibMathSin(0.2), 0.19866933079506122)|0)) return 0;
      if (!(deltaEqual(+StdlibMathTan(0.2), 0.20271003550867250)|0)) return 0;
      if (!(deltaEqual(+StdlibMathExp(0.2), 1.2214027581601699)|0)) return 0;
      if (!(deltaEqual(+StdlibMathLog(0.2), -1.6094379124341003)|0)) return 0;
      if ((StdlibMathClz32(134217728)|0) != 4) return 0;

      if ((StdlibMathImul(6, 7)|0) != 42) return 0;
      if (!(deltaEqual(+StdlibMathAtan2(6.0, 7.0), 0.7086262721276703)|0))
        return 0;
      if (+StdlibMathPow(6.0, 7.0) != 279936.0) return 0;

      return 1;
    }

    return {caller:caller};
  }

  var m = Module(stdlib);
  //assertValidAsm(Module);
  ////assertEquals(1, m.caller());
})();


(function TestStdlibFunctionOutside() {
  function looseEqual(x, y, delta) {
    if (delta === undefined) {
      delta = 1.0e-10;
    }
    if (isNaN(x) && isNaN(y)) {
      return true;
    }
    if (!isFinite(x) && !isFinite(y)) {
      return true;
    }
    x = +x;
    y = +y;
    var t = 0.0;
    t = x - y;
    if (t < 0.0) {
      t = t * -1.0;
    }
    return (t < delta) | 0;
  }

  function plainEqual(x, y) {
    if (isNaN(x) && isNaN(y)) {
      return true;
    }
    return x === y;
  }

  function Module(stdlib) {
    "use asm";
    var ceil = stdlib.Math.ceil;
    var floor = stdlib.Math.floor;
    var sqrt = stdlib.Math.sqrt;
    var abs = stdlib.Math.abs;
    %DebugPrint(abs);
    /*
  DebugPrint: 0x117500285815: [Function] in OldSpace
 - map: 0x117500281f15 <Map[28](HOLEY_ELEMENTS)> [FastProperties]
 - prototype: 0x117500281dc9 <JSFunction (sfi = 0x1175001474d1)>
 - elements: 0x117500000725 <FixedArray[0]> [HOLEY_ELEMENTS]
 - function prototype: <no-prototype-slot>
 - shared_info: 0x11750027a00d <SharedFunctionInfo abs>
 - name: 0x11750024dfdd <String[3]: #abs>
 - builtin: MathAbs
 - formal_parameter_count: 1
 - kind: NormalFunction
 - context: 0x117500281729 <NativeContext[295]>
 - code: 0x117500261a89 <Code BUILTIN MathAbs>
 - properties: 0x117500000725 <FixedArray[0]>
 - All own properties (excluding elements): {
    0x117500000d99: [String] in ReadOnlySpace: #length: 0x117500271bbd <AccessorInfo name= 0x117500000d99 <String[6]: #length>, data= 0x117500000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
    0x117500000dc5: [String] in ReadOnlySpace: #name: 0x117500271ba5 <AccessorInfo name= 0x117500000dc5 <String[4]: #name>, data= 0x117500000069 <undefined>> (const accessor descriptor, attrs: [__C]), location: descriptor
 }

pwndbg> job 0x117500261a89
0x117500261a89: [Code] in ReadOnlySpace
 - instruction_stream: 0
 - instruction_start: 0x7fff7faccd00
// =========================================
pwndbg> vmmap 0x7fff7faccd00
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
             Start                End Perm     Size Offset File
    0x7fff60000000     0x7fff7f480000 rwxp 1f480000      0 [anon_7fff60000]
►   0x7fff7f480000     0x7fff7fff3000 r-xp   b73000 195d000 /home/vult/Desktop/v8/v8/out/debug/libv8.so +0x64cd00
    0x7fff7fff3000     0x7fff80000000 rwxp     d000      0 [anon_7fff7fff3]
/// ===================================================
pwndbg> vmmap
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
             Start                End Perm     Size Offset File
     0x33cd650a000      0x33cd650b000 r--p     1000      0 [anon_33cd650a]
    0x116d00000000     0x117500000000 ---p 800000000      0 [anon_116d00000]
    0x117500000000     0x117500010000 r--p    10000      0 [anon_117500000]
    0x117500010000     0x117500020000 ---p    10000      0 [anon_117500010]
    0x117500020000     0x117500040000 r--p    20000      0 [anon_117500020]
    0x117500040000     0x117500149000 rw-p   109000      0 [anon_117500040]
    0x117500149000     0x117500180000 ---p    37000      0 [anon_117500149]
    0x117500180000     0x11750027e000 r--p    fe000      0 [anon_117500180]
    0x11750027e000     0x117500280000 ---p     2000      0 [anon_11750027e]
    0x117500280000     0x117500300000 rw-p    80000      0 [anon_117500280]
    0x117500300000     0x117600000000 ---p ffd00000      0 [anon_117500300]
    0x117600000000     0x117600100000 rw-p   100000      0 [anon_117600000]
    0x117600100000     0x127d00000000 ---p 106fff00000      0 [anon_117600100]
    0x292300000000     0x292300001000 rw-p     1000      0 [anon_292300000]
    0x292300001000     0x292300040000 ---p    3f000      0 [anon_292300001]
    0x292300040000     0x292300100000 rw-p    c0000      0 [anon_292300040]
    0x292300100000     0x292340000000 ---p 3ff00000      0 [anon_292300100]
    0x351716609000     0x35171660d000 rwxp     4000      0 [anon_351716609]
    0x555555554000     0x55555558e000 r--p    3a000      0 /home/vult/Desktop/v8/v8/out/debug/d8
    0x55555558e000     0x5555555db000 r-xp    4d000  39000 /home/vult/Desktop/v8/v8/out/debug/d8


    */

    var fround = stdlib.Math.fround;
    var fround2 = stdlib.Math.fround;

    var acos = stdlib.Math.acos;
    var asin = stdlib.Math.asin;
    var atan = stdlib.Math.atan;
    var cos = stdlib.Math.cos;
    var sin = stdlib.Math.sin;
    var tan = stdlib.Math.tan;
    var exp = stdlib.Math.exp;
    var log = stdlib.Math.log;

    var atan2 = stdlib.Math.atan2;
    var pow = stdlib.Math.pow;
    var imul = stdlib.Math.imul;
    var min = stdlib.Math.min;
    var max = stdlib.Math.max;

    function ceil_f64(x) { x = +x; return +ceil(x); }
    function ceil_f32(x) { x = fround(x); return fround(ceil(x)); }

    function floor_f64(x) { x = +x; return +floor(x); }
    function floor_f32(x) { x = fround(x); return fround(floor(x)); }

    function sqrt_f64(x) { x = +x; return +sqrt(x); }
    function sqrt_f32(x) { x = fround(x); return fround(sqrt(x)); }

    function abs_f64(x) { x = +x; return +abs(x); }
    function abs_f32(x) { x = fround(x); return fround(abs(x)); }
    function abs_i32(x) { x = x | 0; return abs(x|0) | 0; }

    function acos_f64(x) { x = +x; return +acos(x); }
    function asin_f64(x) { x = +x; return +asin(x); }
    function atan_f64(x) { x = +x; return +atan(x); }
    function cos_f64(x) { x = +x; return +cos(x); }
    function sin_f64(x) { x = +x; return +sin(x); }
    function tan_f64(x) { x = +x; return +tan(x); }
    function exp_f64(x) { x = +x; return +exp(x); }
    function log_f64(x) { x = +x; return +log(x); }

    function atan2_f64(x, y) { x = +x; y = +y; return +atan2(x, y); }
    function pow_f64(x, y) { x = +x; y = +y; return +atan2(x, y); }

    function imul_i32(x, y) { x = x | 0; y = y | 0; return imul(x, y) | 0; }
    function imul_u32(x, y) {
      x = x | 0; y = y | 0; return imul(x>>>0, y>>>0) | 0; }

    // type -> f32
    function fround_i32(x) { x = x | 0; return fround(x|0); }
    function fround_u32(x) { x = x | 0; return fround(x>>>0); }
    function fround_f32(x) { x = fround(x); return fround(x); }
    function fround_f64(x) { x = +x; return fround(x); }

    // type -> f32 -> type
    function fround2_i32(x) { x = x | 0; return ~~fround2(x|0) | 0; }
    function fround2_u32(x) { x = x | 0; return ~~fround2(x>>>0) | 0; }
    function fround2_f32(x) { x = fround2(x); return fround2(x); }
    function fround2_f64(x) { x = +x; return +fround2(x); }

    function min_i32(x, y) { x = x | 0; y = y | 0; return min(x|0, y|0) | 0; }
    function min_f32(x, y) {
      x = fround(x); y = fround(y); return fround(min(x, y)); }
    function min_f64(x, y) { x = +x; y = +y; return +min(x, y); }

    function max_i32(x, y) { x = x | 0; y = y | 0; return max(x|0, y|0) | 0; }
    function max_f32(x, y) {
      x = fround(x); y = fround(y); return fround(max(x, y)); }
    function max_f64(x, y) { x = +x; y = +y; return +max(x, y); }

    return {
      ceil_f64: ceil_f64,
      ceil_f32: ceil_f32,
      floor_f64: floor_f64,
      floor_f32: floor_f32,
      sqrt_f64: sqrt_f64,
      sqrt_f32: sqrt_f32,
      abs_f64: abs_f64,
      abs_f32: abs_f32,
      abs_i32: abs_i32,
      acos_f64: acos_f64,
      asin_f64: asin_f64,
      atan_f64: atan_f64,
      cos_f64: cos_f64,
      sin_f64: sin_f64,
      tan_f64: tan_f64,
      exp_f64: exp_f64,
      log_f64: log_f64,
      imul_i32: imul_i32,
      imul_u32: imul_u32,
      fround_i32: fround_i32,
      fround_u32: fround_u32,
      fround_f32: fround_f32,
      fround_f64: fround_f64,
      fround2_i32: fround2_i32,
      fround2_u32: fround2_u32,
      fround2_f32: fround2_f32,
      fround2_f64: fround2_f64,
      min_i32: min_i32,
      min_f32: min_f32,
      min_f64: min_f64,
      max_i32: max_i32,
      max_f32: max_f32,
      max_f64: max_f64,
    };
  }
  var m = Module(stdlib);
  //assertValidAsm(Module);
  var values = {
    i32: [
      0, 1, -1, 123, 456, -123, -456,
      0x40000000, 0x7FFFFFFF, -0x80000000,
    ],
    u32: [
      0, 1, 123, 456,
      0x40000000, 0x7FFFFFFF, 0xFFFFFFFF, 0x80000000,
    ],
    f32: [
      0, -0, 1, -1, 0.25, 0.125, 0.9, -0.9, 1.414,
      0x7F, -0x80, -0x8000, -0x80000000,
      0x7FFF, 0x7FFFFFFF, Infinity, -Infinity, NaN,
    ],
    f64: [
      0, -0, 1, -1, 0.25, 0.125, 0.9, -0.9, 1.414,
      0x7F, -0x80, -0x8000, -0x80000000,
      0x7FFF, 0x7FFFFFFF, Infinity, -Infinity, NaN,
    ],
  };
  var converts = {
    i32: function(x) { return x | 0; },
    u32: function(x) { return x >>> 0; },
    f32: function(x) { return Math.fround(x); },
    f64: function(x) { return x; },
  };
  var two_args = {atan2: true, pow: true, imul: true,
                  min: true, max: true};
  var funcs = {
    ceil: ['f32', 'f64'],
    floor: ['f32', 'f64'],
    sqrt: ['f32', 'f64'],
    abs: ['i32', 'f32', 'f64'],
    acos: ['f64'],
    asin: ['f64'],
    atan: ['f64'],
    cos: ['f64'],
    sin: ['f64'],
    tan: ['f64'],
    exp: ['f64'],
    log: ['f64'],
    imul: ['i32', 'u32'],
    fround: ['i32', 'u32', 'f32', 'f64'],
    min: ['i32', 'f32', 'f64'],
    max: ['i32', 'f32', 'f64'],
  };
  var per_func_equals = {
    // JS uses fdlib for these, so they may not match.
    // ECMAscript does not required them to have a particular precision.
    exp_f64: function(x, y) { return looseEqual(x, y, 1e55); },
    sqrt_f32: function(x, y) { return looseEqual(x, y, 1e-5); },
    cos_f64: looseEqual,
    sin_f64: looseEqual,
    tan_f64: looseEqual,
    // TODO(bradnelson):
    // Figure out why some builds (avx2, rel_ng) return a uint.
    imul_u32: function(x, y) { return (x | 0) === (y | 0); },
  };
  for (var func in funcs) {
    var types = funcs[func];
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      var interesting = values[type];
      for (var j = 0; j < interesting.length; j++) {
        for (var k = 0; k < interesting.length; k++) {
          var val0 = interesting[j];
          var val1 = interesting[k];
          var name = func + '_' + type;
          if (func === 'fround') {
            // fround returns f32 regardless of input.
            var expected = Math[func](val0);
            var actual = m[name](val0);
          } else if (two_args[func]) {
            var expected = converts[type](Math[func](val0, val1));
            var actual = m[name](val0, val1);
          } else {
            var expected = converts[type](Math[func](val0, val1));
            var actual = m[name](val0, val1);
          }
          var compare = per_func_equals[name];
          if (compare === undefined) {
            compare = plainEqual;
          }
          //assertTrue(typeof(compare) === 'function');
          if (!compare(expected, actual)) {
            print(expected + ' !== ' + actual + ' for ' + name +
                  ' with input ' + val0 + ' ' + val1);
            //assertTrue(false);
          }
        }
      }
    }
  }
})();
