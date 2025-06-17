
MODE=$1

if [ "$MODE" = "test" ]; then
    # ./v8/out/debug/d8 wasm-type-confusion/pocs/regress-374790906.js --experimental-wasm-exnref
    # --experimental-wasm-exnref --expose-gc
    ./v8/out/debug/d8 $2 --allow-natives-syntax --jit-fuzzing

elif [ "$MODE" = "build" ]; then
    ./v8/tools/dev/v8gen.py arm.release
    ninja -C out.gn/arm.release

else
    echo "Invalid mode"
fi