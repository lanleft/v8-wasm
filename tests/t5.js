function foo() {
    const v11 = new Int8Array(150);
    Object(v11,...v11,v11);
  }
  
  foo();
  const dummy = new Int8Array(150);
  %DebugPrint(dummy);
  console.log("=====================================================================");
//   %DebugPrint(foo);
  %SystemBreak();
  
  foo();