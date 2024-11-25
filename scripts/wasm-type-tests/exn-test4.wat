(module
  ;; Import the throw_js function from JavaScript
  (import "m" "import" (func $throw_js (param externref)))

  ;; Import the to_exnref function
  (import "m" "to_exnref" (func $to_exnref (param externref) (result exnref)))

  ;; Define memory
  (memory $memory 1 10)

  ;; Main function
  (func $main (param $0 externref)
    ;; Convert externref to exnref
    local.get $0
    call $to_exnref

    ;; Attempt a ref.cast null (safe cast)
    gc.ref.cast null 10 ;; This is a placeholder, replace "10" with proper type index

    ;; Throw as exnref
    throw_ref)

  ;; Export main function
  (export "main" (func $main))
)
