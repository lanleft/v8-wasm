// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 -test /home/vult/Desktop/v8-wasm/v8/test/mjsunit/mjsunit.js /home/vult/Desktop/v8-wasm/scripts/simple-tests/test9.js --no-liftoff  --experimental-wasm-exnref --allow-natives-syntax --turboshaft-wasm

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

function throw_js_eh222(r) {
    console.log("================ throw_js22222 object =================");
    %DebugPrint(r);
     throw r; }

let builder = new WasmModuleBuilder();
let throw2 = builder.addImport('m', 'throw_js_eh222', makeSig([kWasmNullExnRef], []));


builder.addFunction('nullCastNullToExnRef', makeSig([], []))
.addLocals(kWasmNullExnRef, 1)
.addBody([
    kExprLocalGet, 0,
    // kGCPrefix, kExprRefCastNull, kNullExnRefCode,
    // kGCPrefix, kExprRefCastNull, kExnRefCode,
    kExprCallFunction, throw2,
]).exportFunc();

let instance = builder.instantiate({m: {throw_js_eh222: Function.prototype.call.bind(throw_js_eh222)}});
// each import function call `=== ../../src/wasm/function-body-decoder-impl.h:3534` 1 time

let obj = {};

try {
  instance.exports.nullCastNullToExnRef();
} catch (e) {
    console.log("================== catch object =====================");
    console.log(e);
    %DebugPrint(e);
    console.log(e.a.b);
    // %SystemBreak();
}
