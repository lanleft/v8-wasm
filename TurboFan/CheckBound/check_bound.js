let f = function(ta) {
    let idx = Math.floor(Math.random());
    return ta[idx];
  }
  
  for (var i = 0; i < 0x10000; ++i) {
    let a = f(new Float64Array([i,i,i,i]));
    console.log(a);
}