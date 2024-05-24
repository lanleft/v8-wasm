

## V8 Sandbox

- Setting up commands
```cpp
r --allow-natives-syntax --sandbox-testing ../test.js

// printing process infomation: pid, cmdline, cwd, exe,...
info proc

// process mapping 
info proc map 
```

- Challenges:
    `Write to the page starting at 0x587b312b000`
- mmap 
```
587b312b000-587b312c000 r--p 00000000 00:00 0 
138f00000000-139700000000 ---p 00000000 00:00 0 
139700000000-139700010000 r--p 00000000 00:00 0 
139700010000-139700020000 ---p 00000000 00:00 0 
139700020000-139700040000 r--p 00000000 00:00 0 
139700040000-139700149000 rw-p 00000000 00:00 0 
139700149000-139700180000 ---p 00000000 00:00 0 
139700180000-13970027e000 r--p 00000000 00:00 0 
13970027e000-139700280000 ---p 00000000 00:00 0 
139700280000-1397002c0000 rw-p 00000000 00:00 0 
1397002c0000-139800000000 ---p 00000000 00:00 0 
139800000000-139800100000 rw-p 00000000 00:00 0 
139800100000-149f00000000 ---p 00000000 00:00 0 
343b00000000-343b00001000 rw-p 00000000 00:00 0 
343b00001000-343b00040000 ---p 00000000 00:00 0 
343b00040000-343b00080000 rw-p 00000000 00:00 0 
343b00080000-343b40000000 ---p 00000000 00:00 0 
555555554000-555555576000 r--p 00000000 08:03 6506518                    /home/vult/Desktop/v8/v8/out/debug/d8
555555576000-5555555c2000 r-xp 00021000 08:03 6506518                    /home/vult/Desktop/v8/v8/out/debug/d8


```

- output:
```
pwndbg> x/20gx 0x1397000493f5-1
0x1397000493f4:	0x414141410028380d	0x0000000000004141
0x139700049404:	0x00000068000493b1	0x0000000000000000
0x139700049414:	0x0000000100000000	0x0000000100000000
0x139700049424:	0x0100000000000000	0x0000000000000000
0x139700049434:	0x0000000000000000	0xbeadbeef00000000
0x139700049444:	0xbeadbeefbeadbeef	0xbeadbeefbeadbeef
0x139700049454:	0xbeadbeefbeadbeef	0xbeadbeefbeadbeef
0x139700049464:	0xbeadbeefbeadbeef	0xbeadbeefbeadbeef
0x139700049474:	0xbeadbeefbeadbeef	0xbeadbeefbeadbeef

```
### Studying Previous Sandbox Escape Techniques
- V8 virtual memory cage

**Idea 1: Corrupting a Function object to redirect code execution to an arbitrary location**
Example:
```js
const foo = () => {
  return;
}
%DebugPrint(foo);
%SystemBreak();

```
The author manipulates the `code_entry_point` of a function that it's possible to redirect execution to a controlled address. In the newest version, they didn't store `code_entry_point` raw pointer in the v8 memory.  

### Mutable Page Metadata

- heap_base
```js
// heap_base
let ofs1 = 0x48;
let leak_addr = v8_read64(ofs1);
let ofs2 = leak_addr & 0xffffffffn;
let ofs3 = leak_addr & 0xffffffff00000000n;
let leak_addr2 = ofs3 + 0x48n;
console.log("addr[0x" + ofs1.toString(16) + "] = 0x" + leak_addr.toString(16));
console.log("ofs2: ", ofs2.toString(16));
console.log("ofs2 value: ", v8_read64(ofs2).toString(16));
console.log("before writing to addr: 0x"+ leak_addr2.toString(16));
// 0x35b200000048

%SystemBreak();

v8_write64(ofs2, 0x4141414142424242n);
%SystemBreak();
```
**what is heap metadata ptmalloc on v8?**
```
#
# Fatal error in ../../src/heap/mutable-page-inl.h, line 57
# Debug check failed: owner() == nullptr == Chunk()->InReadOnlySpace() (0 vs. 1).
#
// Stacktrace

#0  0x00007ffff4028016 in v8::base::OS::Abort() () at ../../src/base/platform/platform-posix.cc:699
#1  0x00007ffff400b8cb in V8_Fatal(char const*, int, char const*, ...) () at ../../src/base/logging.cc:205
#2  0x00007ffff400b305 in v8::base::(anonymous namespace)::DefaultDcheckHandler(char const*, int, char const*) () at ../../src/base/logging.cc:57
#3  0x00007ffff5bffedd in v8::internal::MainAllocator::Verify() const () at ../../src/heap/mutable-page-inl.h:57
#4  0x00007ffff5c00ead in v8::internal::MainAllocator::FreeLinearAllocationArea() () at ../../src/heap/main-allocator.cc:338
#5  0x00007ffff5b9988e in v8::internal::HeapAllocator::FreeLinearAllocationAreas() () at ../../src/heap/heap-allocator.cc:236
#6  0x00007ffff5bd1b64 in v8::internal::Heap::StartTearDown() () at ../../src/heap/heap.cc:6106
#7  0x00007ffff5a1963c in v8::internal::Isolate::Deinit() () at ../../src/execution/isolate.cc:4151
#8  0x00007ffff5a191b3 in v8::internal::Isolate::Delete(v8::internal::Isolate*) () at ../../src/execution/isolate.cc:3833
#9  0x000055555559e4c9 in v8::Shell::OnExit(v8::Isolate*, bool) () at ../../src/d8/d8.cc:3901
#10 0x00005555555ab4bd in v8::Shell::Main(int, char**) () at ../../src/d8/d8.cc:6233
#11 0x00007ffff3833083 in __libc_start_main (main=0x5555555ab830 <main>, argc=4, argv=0x7fffffffe308, init=<optimized out>, fini=<optimized out>, rtld_fini=<optimized out>, stack_end=0x7fffffffe2f8) at ../csu/libc-start.c:308
#12 0x0000555555576c9a in _start ()
```
