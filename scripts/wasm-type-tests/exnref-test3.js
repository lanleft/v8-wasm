function throw_js_eh222(r) {
    console.log("================ throw_js22222 object =================");
    %DebugPrint(r);
    throw r;
}

async function runTest() {
    
    const wasmModule = await WebAssembly.compile(wasmBytes);
    const instance = await WebAssembly.instantiate(wasmModule, {
        m: {
            throw_js_eh222: Function.prototype.call.bind(throw_js_eh222)
        }
    });

    try {
        instance.exports.nullCastNullToExnRef();
    } catch (e) {
        console.log("================== catch object =====================");
        console.log(e);
        %DebugPrint(e);
        console.log(e.a.b);
    }
}

runTest();