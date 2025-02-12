
/// Flags: 

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

let {tag, thrower} = (()=>{
    let builder = new WasmModuleBuilder();
    let $s0 = builder.addStruct([makeField(kWasmI64, true)]);
    let $s1 = builder.addStruct([makeField(kWasmI64, true), makeField(kWasmI64, true), makeField(kWasmI64, true)], $s0);
    let $sig_v_s1 = builder.addType(makeSig([wasmRefType($s1)], []), kNoSuperType, false);
    let $sig_v_s0 = builder.addType(makeSig([wasmRefType($s0)], []), $sig_v_s1);  // sig_v_s0 <: sig_v_s1
    let $tag = builder.addTag($sig_v_s0);
    builder.addExportOfKind('tag', kExternalTag, $tag);
    builder.addFunction('thrower', kSig_v_l).addBody([
      kExprLocalGet, 0,
      kGCPrefix, kExprStructNew, $s0,
      kExprThrow, $tag,
    ]).exportFunc();
    return builder.instantiate().exports;
  })();
  
  let builder = new WasmModuleBuilder();
  let $s0 = builder.addStruct([makeField(kWasmI64, true)]);
  let $s1 = builder.addStruct([makeField(kWasmI64, true), makeField(kWasmI64, true), makeField(kWasmI64, true)], $s0);
  let $sig_v_s1 = builder.addType(makeSig([wasmRefType($s1)], []), kNoSuperType, false);
  let $sig_v_s0 = builder.addType(makeSig([wasmRefType($s0)], []), $sig_v_s1);
  let $tag = builder.addImportedTag('import', 'tag', $sig_v_s1);
  let $thrower = builder.addImport('import', 'thrower', kSig_v_l);
  let $f = builder.addFunction('f', kSig_l_l).addBody([
    kExprTry, kWasmI64,
      kExprLocalGet, 0,
      kExprCallFunction, $thrower,
      kExprUnreachable,
    kExprCatch, $tag,
      kGCPrefix, kExprStructGet, $s1, 1,
    kExprEnd,
  ]).exportFunc();
  
  let instance = builder.instantiate({import: {thrower, tag}});
  let {f} = instance.exports;
  
  console.log(f(0n).toString(16));