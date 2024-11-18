(module
  (import "js" "throwNull" (func $throwNull)) ;; JS function to throw null
  (func $handleException (result i32)
    (try (result i32)
      (do
        (call $throwNull) ;; JS null is thrown here
        (i32.const 0))    ;; Fallback if no exception is thrown
      (catch_all ;; Catch JS null as an exception reference
        (i32.const 1))    ;; Return 1 if JS null is caught
    ;;   (catch_all
    ;;     (i32.const 2))    ;; Catch-all for other exceptions
    )
  )
  (func $testNullExnref
    (result i32)
    (try (result i32)
      (do
        (throw null)       ;; Throw a null exnref
        (i32.const 0))     ;; Fallback if no exception is thrown
      (catch_all
        (i32.const 1))     ;; Won’t trigger since null exnref isn’t a valid exception
    ;;   (catch_all
    ;;     (i32.const 2))    ;; Null exnref is caught here
    )
  )
  (export "handleException" (func $handleException))
  (export "testNullExnref" (func $testNullExnref))
)
