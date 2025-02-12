// Flags:  --experimental-wasm-exnref

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


function js_set_struct(r) {// [1]
    r[0] = 0xdeadbeef;
    }

let builder = new WasmModuleBuilder();
let struct = builder.addStruct([makeField(kWasmI64, true)]);
let sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));
let setStruct = builder.addImport('m', 'js_set_struct', makeSig([], []));// [2]

%DebugPrint(setStruct);

builder.addFunction('wasm_set_struct', makeSig([], []))
.addBody([
    kExprLocalGet, 0,
    kExprCallFunction, setStruct, // [3]
]).exportFunc();

const instance = builder.instantiate({'m': {'js_set_struct': js_set_struct}});
instance.exports.wasm_set_struct(0xdeadbeefn);