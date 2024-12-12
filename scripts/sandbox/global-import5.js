// # Fatal JavaScript out of memory: Reached heap limit

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

 
let builder = new WasmModuleBuilder();


// 4294967296
for (let i = 0; i < 268435456; i++) {
  builder.addGlobal(kWasmS128, true, false);
}

builder.addGlobal(kWasmS128, true, false).exportAs("globaln");

// const g1 = builder.addGlobal(kWasmNullExternRef, true, false).exportAs("global1");

// const g2 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global2");
// builder.addGlobal(kWasmI32, true, false); // Dummy.
// builder.addGlobal(kWasmI32, true, false); // Dummy.
// const g3 = builder.addGlobal(kWasmExternRef, true, false).exportAs("global3");
// const g4 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global4");


const instance = builder.instantiate();

gn = instance.exports.globaln;

%DebugPrint(gn);

