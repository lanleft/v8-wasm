# Turbofan on V8 

introduction ...

### Table of Content

- [What is JIT?](#What-is-JIT?)
- [CTF challenges](#CTF-challenges)

## What is JIT?

### Blogs

- [Turbofan - optiomizer vulnerability](https://github.com/google/google-ctf/tree/master/2018/finals/pwn-just-in-time)
- [Introducing to Turbofan](https://doar-e.github.io/blog/2019/01/28/introduction-to-turbofan/)
- [Modern attacks on the chrome browser optimizations and deoptimizations](https://doar-e.github.io/blog/2020/11/17/modern-attacks-on-the-chrome-browser-optimizations-and-deoptimizations/)
- https://www.anquanke.com/post/id/227493
- https://www.anquanke.com/post/id/229554
- https://www.youtube.com/watch?v=Ihc9WbtruE8&list=PLceyrQSWkM_cRCohq7hH8CJoYi95FTk9P&index=19

- [Mojo](https://github.com/google/google-ctf/tree/master/2018/finals/pwn-mojo)
- [Scudo](https://github.com/google/google-ctf/tree/master/2018/finals/pwn-scudo)
- https://mem2019.github.io/jekyll/update/2022/07/03/Google-CTF.html
- https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html



## CTF challenges

### Build

```bash
# git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
# echo "export PATH=/home/pwn/tools/depot_tools" >> ~/.bashrc

# fetch v8
# cd v8
./build/install-build-deps.sh # Assumes you're using apt
git reset --hard e0a58f83255d1dae907e2ba4564ad8928a7dedf4 # find by v8's version
# git checkout 7.0.276.3 # or
gclient sync -D
git apply ../pwn-just-in-time/attachments/addition-reducer.patch
./tools/dev/v8gen.py x64.release
ninja -C ./out.gn/x64.release # Release version
```

### Prepare Turbolizer

- online tool: https://v8.github.io/tools/head/turbolizer/index.html

### Speculative Optimization

![optimization-graph](image.png)


- [CheckBound Elimination](https://docs.google.com/document/d/1R7-BIUnIKFzqki0jR4SfEZb3XmLafa04DLDrqhxgZ9U/edit#)


**Mitigation**

- No pointer compression

### Playing with JIT 

**NumberAdd**

