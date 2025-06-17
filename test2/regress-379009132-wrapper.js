/*
    --wasm-wrapper-tiering-budget=1
    Looks like the WasmFuncRef leaks to JS, instead of being translated to the JSFunction at the boundary.
*/

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

const builder = new WasmModuleBuilder();
const type = builder.nextTypeIndex();
builder.addType(makeSig([], [wasmRefType(type)]));
const func2 = builder.addFunction('func2', type);
func2.addBody([kExprRefFunc, func2.index]).exportFunc();
const instance = builder.instantiate();
// Trigger wrapper tier-up.
instance.exports.func2();
// This call runs the compiled wrapper, which returns a WasmFuncRef.
const v200 = instance.exports.func2();
%DebugPrint(v200);
v200.toString();
