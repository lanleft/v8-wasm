// # Fatal JavaScript out of memory: Reached heap limit

d8.file.execute("/home/vult/Desktop/v8-wasm/v8/test/mjsunit/wasm/wasm-module-builder.js");

 
let builder = new WasmModuleBuilder();


// 4294967296
for (let i = 0; i < 268435456; i++) {
  builder.addGlobal(kWasmS128, true, false);
}

builder.addGlobal(kWasmS128, true, false).exportAs("globaln");

const instance = builder.instantiate();

gn = instance.exports.globaln;

%DebugPrint(gn);

/*
<--- Last few GCs --->

[2273210:0x5555555e2000]    97960 ms: Mark-Compact (reduce) 4072.0 (4074.8) -> 4071.4 (4073.3) MB, pooled: 0 MB, 1888.06 / 0.00 ms  (+ 111.4 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 2024 ms) (average mu = 

<--- JS stacktrace --->



#
# Fatal JavaScript out of memory: Reached heap limit
#
==== C stack trace ===============================

    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8_libbase.so(v8::base::debug::StackTrace::StackTrace()+0x13) [0x7ffff3f05753]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8_libplatform.so(+0x1629d) [0x7ffff3eb329d]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8_libbase.so(v8::base::FatalOOM(v8::base::OOMType, char const*)+0x38) [0x7ffff3ee6508]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, v8::OOMDetails const&)+0x371) [0x7ffff54a7071]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(+0x1bbdec7) [0x7ffff5acdec7]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags)+0x5b4) [0x7ffff5acb874]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(v8::internal::HeapAllocator::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment)+0xce) [0x7ffff5aa4b9e]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment)+0x22) [0x7ffff5aa4e02]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(v8::internal::Factory::NewFillerObject(int, v8::internal::AllocationAlignment, v8::internal::AllocationType, v8::internal::AllocationOrigin)+0x7b) [0x7ffff5a5506b]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(+0x249ad9f) [0x7ffff63aad9f]
    /home/vult/Desktop/v8-wasm/v8/out/debug/libv8.so(+0x249a8d0) [0x7ffff63aa8d0]
    [0x7fff7f8a9cbd]
[1]    2273210 trace trap (core dumped)  /home/vult/Desktop/v8-wasm/v8/out/debug/d8  --allow-natives-syntax

*/