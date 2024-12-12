

# V8 Sandbox Research Tasks

- [Debug setting and previous issues of V8 bypass sandbox](overview/debug-setting-and-previous-issues.md)

## 1. Core Sandbox Components
- Study the three main pointer tables outside the sandbox:
  - [Trusted Pointer Table (TPT)](./KB/TPT.md) and [Sandbox decode pointer](KB/sandbox-decode-pointer.md) - Used for referencing trusted heap objects
  - External Buffer Pointer Table - Stores pointers and sizes for external buffers
  - Code Pointer Table - Contains code object pointers and entrypoints
  - [MemoryChunk header](KB/page-metadata.md)

## 2. Memory Layout Analysis
- Map and understand the sandbox memory regions:
  - Read-only regions
  - Writable regions
  - Code regions
  - Trusted space layout
- Document typical memory mappings and permissions

## 3. Key Attack Vectors

### WebAssembly Related
  - Wasm instance objects
  - Wasm function objects
  - Memory limitations and boundaries
  - Function data handling

### Array/Buffer Objects
  - JSArray internals
  - ArrayBuffer implementation
  - SharedArrayBuffer specifics
  - DataView functionality


## 4. Previous Exploit Techniques
- Study documented sandbox escapes:
  - Function object corruption techniques
  - WebAssembly-based exploits
  - Global value manipulation
  - Mutable page metadata attacks
  - [Wasm type knowledge and previous issues](scripts/wasm-type.md)
  - Wasm Table Object

## 5. Security Mechanisms
- Understand protection features:
  - Pointer sandboxing
  - Code pointer handling
  - Trusted space isolation
  - Memory corruption mitigations

## 6. Development Tools
- Set up debugging environment:
  - Configure d8 with proper flags
  - Set up GDB/debugging tools
  - Enable relevant V8 flags for testing

## 7. Documentation & References
- Maintain documentation of:
  - Memory layout findings
  - Object structure details
  - Successful exploit techniques
  - Failed attempts and reasons

## 8. Current Research Areas
- Focus on recent changes:
  - Removal of function pointers from sandbox
  - Changes to trusted data handling
  - New security measures
  - Recent CVEs and patches


