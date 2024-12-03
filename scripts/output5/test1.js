// Flags: --experimental-wasm-stringref --allow-natives-syntax

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


(function TestIntToString() {
  console.log("Testing IntToString");
  let builder = new WasmModuleBuilder();
  let sig_w_ii = makeSig([kWasmI32, kWasmI32], [kWasmStringRef]);
  let sig_v_ii = makeSig([kWasmI32, kWasmI32], []);
  
  let intToString = builder.addImport("m", "intToString", sig_w_ii);
  builder.addFunction('call_inttostring', sig_w_ii).exportFunc().addBody([
    kExprLocalGet, 0,
    kExprLocalGet, 1,
    kExprCallFunction, intToString,
  ]);

// let except = builder.addTag(kSig_v_v);
// builder.addFunction('call_inttostring', sig_v_ii).exportFunc().addBody([
//     kExprTry, kWasmVoid,
//         kExprLocalGet, 0,
//         kExprLocalGet, 1,
//         kExprCallFunction, intToString,
//     kExprCatchAll,
//         kExprRethrow, 0x00,
//     kExprEnd,
//   ]);

  let func = Function.prototype.call.bind(Number.prototype.toString);
  let instance = builder.instantiate({ m: { intToString: func } });
  let call_inttostring = instance.exports.call_inttostring;
  %WasmTierUpFunction(call_inttostring);

  try {
    call_inttostring(-123, 37);
  } catch (e) {
    console.log("===================== catch obj==================");
    console.log(e);
    %DebugPrint(e);
    // console.log(e.a.b.c);
  }

//   console.log(call_inttostring(-123, 10));
//   assertEquals("42", call_inttostring(42, 10));
//   assertEquals("-123", call_inttostring(-123, 10));
//   assertEquals("2a", call_inttostring(42, 16));
//   assertEquals("2147483647", call_inttostring(2147483647, 10));
//   assertEquals("-2147483648", call_inttostring(-2147483648, 10));
//   CheckStackTrace(
//       () => call_inttostring(1, 99), () => func(1, 99), 'call_inttostring');

})();
