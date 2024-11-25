(module
  ;; import tag that will be referred to here as $tagname
  (import "extmod" "exttag" (tag $tagname (param externref)))

  ;; $throwException function throws i32 param as a $tagname exception
  (func $throwException (param $errorValueArg externref)
    local.get $errorValueArg
    throw $tagname
  )

  ;; Exported function "run" that calls $throwException
  (func (export "run") (param externref)
    local.get 0
    call $throwException
  )
)
