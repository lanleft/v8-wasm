(module
  (tag $nullExnref (param)) ;; Declare a tag for the null exception reference

  ;; Function to throw a null exnref
  (func $throwNullExnref
    (throw $nullExnref)) ;; Use the declared tag to throw a null exception reference

  ;; Function to handle exceptions
  (func $handleException (result i32)
    (try (result i32)
      (do
        (call $throwNullExnref) ;; Call the function that throws a null exnref
        (i32.const 0))          ;; Fallback if no exception is thrown
      (catch_ref $nullExnref   ;; Catch the null exnref
        (i32.const 1))          ;; Catch block for rethrowable references (not triggered here)
    ;;   (catch_all
    ;;     (i32.const 2))         ;; Null exnref caught here
    )
  )

  (export "handleException" (func $handleException))
)
