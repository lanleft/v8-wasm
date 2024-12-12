d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

 
let builder = new WasmModuleBuilder();


// 4294967296
for (let i = 0; i < 3; i++) {
  builder.addGlobal(kWasmExternRef, true, false);
}

builder.addGlobal(kWasmExternRef, true, false).exportAs("globaln");

// const g1 = builder.addGlobal(kWasmNullExternRef, true, false).exportAs("global1");

// const g2 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global2");
// builder.addGlobal(kWasmI32, true, false); // Dummy.
// builder.addGlobal(kWasmI32, true, false); // Dummy.
// const g3 = builder.addGlobal(kWasmExternRef, true, false).exportAs("global3");
// const g4 = builder.addGlobal(kWasmAnyFunc, true, false).exportAs("global4");

// %DebugPrint(builder);
// %SystemBreak();
let global_x = new WebAssembly.Global({value: "externref", mutable: true});
let global_y = new WebAssembly.Global({value: "externref", mutable: true});

const instance = builder.instantiate();

gn = instance.exports.globaln;


%DebugPrint(gn);
%DebugPrint(global_x);
%DebugPrint(global_y);
%SystemBreak();

