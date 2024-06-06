(module
  (memory $mem 1) ;; Declare a memory with an initial size of 1 page (64KiB)

  (export "memory" (memory $mem)) ;; Export the memory to be accessible from JavaScript

  (func $store (param $addr i32) (param $value i32)
    ;; Store the value at the specified address
    (i32.store
      (local.get $addr)
      (local.get $value)
    )
  )
  (export "store" (func $store)) ;; Export the store function

  (func $load (param $addr i32) (result i32)
    ;; Load and return the value from the specified address
    (i32.load
      (local.get $addr)
    )
  )
  (export "load" (func $load)) ;; Export the load function
)
