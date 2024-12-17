
// /home/vult/Desktop/v8-wasm/v8/out/debug/d8 /home/vult/Desktop/v8-wasm/scripts/sandbox/process-exports.js --sandbox-testing --allow-natives-syntax

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

// module 0
let builder = new WasmModuleBuilder();
let $struct = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls = builder.addType(makeSig([kWasmI64, wasmRefType($struct)], []));

let $func0 = builder.addFunction("func0", $sig_v_ls)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct, 0,
  ]);

let $t0 = builder
    .addTable(wasmRefType($sig_v_ls), 1, 10, [kExprRefFunc, $func0.index])
    .exportAs('table0');

let instance0 = builder.instantiate();
let { table0, func0 } = instance0.exports;

// module 1
builder = new WasmModuleBuilder();
let $sig_v_ll = builder.addType(makeSig([kWasmI64, kWasmI64], []));

let $func1 = builder.addFunction("func1", $sig_v_ll).exportFunc()
    .addBody([
        kExprLocalGet, 1,
        kExprLocalGet, 0,
        kExprReturn,
    ]);


let $boom = builder.addFunction("boom", $sig_v_ll)
  .exportFunc()
  .addBody([
      kExprLocalGet, 0,
    kExprLocalGet, 1,
    kExprI32Const, 0,
    kExprCallIndirect, $sig_v_ll, 0,
  ])
let $t1 = builder
  .addTable(wasmRefType($sig_v_ll), 1, 1, [kExprRefFunc, $func1.index])
  .exportAs('table1');

let instance1 = builder.instantiate();
%DebugPrint(instance1);

console.log("Before procecssing exports of instance1");
let { table1, boom, func1 } = instance1.exports;