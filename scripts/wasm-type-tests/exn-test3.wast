
;; (module
;;   (import "m" "throw_js_eh222" (func $throw_js_eh222 (param externref) ))

;;   (func (export "exnref") (result exnref) (ref.null exn))
  
;; ;;   (func $nullCastNullToExnRef (export "nullCastNullToExnRef")
;; ;;     (local $0 externref)
;; ;;     local.get $0
;; ;;     ;; call ref.cast 
;; ;;     ref.null exn
;; ;;     ;; ref.cast null (ref null exn)
;; ;;     ;; ref.cast null externref
;; ;;     call $throw_js_eh222
;; ;;   )
;; )

(module
  (func (export "externref") (result externref) (ref.null extern))
  (func (export "exnref") (result exnref) (ref.null exn))
  (func (export "funcref") (result funcref) (ref.null func))

  (global externref (ref.null extern))
  (global exnref (ref.null exn))
  (global funcref (ref.null func))
)

(assert_return (invoke "externref") (ref.null extern))
(assert_return (invoke "exnref") (ref.null exn))
(assert_return (invoke "funcref") (ref.null func))