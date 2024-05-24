

## V8 Sandbox

- Setup 
```cpp
r --allow-natives-syntax --sandbox-testing ../test.js

// printing process infomation: pid, cmdline, cwd, exe,...
info proc

// process mapping 
info proc map 
```

- Challenge:
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

*Idea 1*: Corrupting a Function object to redirect code execution to an arbitrary location
Example:
```js
const foo = () => {
  return;
}
%DebugPrint(foo);
%SystemBreak();

```
The author manipulates the `code_entry_point` of a function that it's possible to redirect execution to a controlled address. In the newest version, they didn't store `code_entry_point` raw pointer in the v8 memory.  

### Object's layer
- heap_base
```js
// heap_base
let ofs1 = 0x48;
let leak_addr = v8_read64(ofs1);
console.log("addr[", ofs1.toString(16), "] = ", leak_addr.toString(16));
// addr[ 48 ] =  236500040000
```
