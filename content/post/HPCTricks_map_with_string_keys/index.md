---
title: 【高性能C++奇技淫巧】当你要用很多短字符串当字典key
description: "如果你有这样的情景：
- 需要创建一个字典，而字典的key都是很短（长度不超过8）的字符串。
- 同时你又需要追求高性能，希望能达到纳秒级的时延优化。
 
那么你会怎么做呢？"
slug: HPCTricks_map_with_string_keys
date: 2023-10-07 00:00:00+0800
lastmod: 2026-07-20 00:00:00+0800
math: true
image: cover.png
categories:
  - 开发杂谈
tags:
  - backend
  - performance
  - cpp
  - tricks
---

如果你有这样的情景：
- 需要创建一个字典，而字典的key都是很短（长度不超过8）的字符串。
- 同时你又需要追求高性能，希望能达到纳秒级的时延优化。
 
那么你会怎么做呢？

<!-- more -->

很常见的做法是：

```cpp
std::unordered_map<std::string, T> dict;
```

但是其实，我们可以针对这个场合做出神奇的优化：

众所周知，字符串是由字符组成的，而每个字符占1个字节，也就是说相当于一个`int8_t`或者`uint8_t`。
而如果key都不超过8，那么$8 \times 8 = 64$，我们完全可以将其convert为一个`uint64_t`。即

```cpp
std::unordered_map<uint64_t, T> dict;
char str[10];   // strlen(str) <= 8
dict.insert({*reintepret_cast<uint64_t*>(str), _});
```

这么一看你就懂了吧！无须多言。最后我们上个效率对比吧，看看能有多大的提升：

![可以看到，find操作是2.6倍的快](cover.png)

你也可以[在此在线观看这个benchmark](https://quick-bench.com/q/yiUMubp7mDrmwQh4zJVML8q2Pw4)。

## 补充：用 `_mm_crc32_u64` 做哈希

如果 `uint64_t` key 的取值分布比较有规律，例如前缀相同、只有少数字节变化，直接把它作为 `unordered_map` 的 key 虽然没有问题，但未必能得到理想的 bucket 分布。x86 的 SSE4.2 提供了 `_mm_crc32_u64`：它把一个 64 位输入累加进 CRC-32C 状态，可作为一个很便宜的**非加密哈希混合步骤**。对应的是 `CRC32 r64, r/m64` 指令；尽管 intrinsic 的返回类型是 `uint64_t`，CRC-32C 的有效结果仍然只有低 32 位。[Intel 指令参考](https://www.intel.co.jp/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2d-manual.pdf)和 [Clang 的 intrinsic 定义](https://clang.llvm.org/doxygen/crc32intrin_8h_source.html)都可以交叉确认这一点。

```cpp
#include <cstdint>
#include <functional>
#include <nmmintrin.h>  // _mm_crc32_u64

struct crc32c_hash {
    std::size_t operator()(std::uint64_t key) const noexcept {
        // 初始 CRC 状态为 0；返回值只有低 32 位有意义。
        return static_cast<std::uint32_t>(_mm_crc32_u64(0, key));
    }
};

std::unordered_map<std::uint64_t, T, crc32c_hash> dict;
```

编译这段代码时，GCC/Clang 需要启用 SSE4.2，例如加上 `-msse4.2`；若二进制会在机器型号不受控的环境运行，还必须在调用前做 CPU 特性分发（GCC/Clang 可用 `__builtin_cpu_supports("sse4.2")`），否则不支持该指令的 CPU 会触发非法指令异常。`_mm_crc32_u64` 只适用于 64 位 x86；在 ARM、32 位进程或需要可移植构建时，应保留普通 hash 的 fallback。

这里还有三个容易踩的坑：

- 这是 **CRC-32C（Castagnoli）**，不是常见文件校验里的 IEEE CRC-32；不要拿它和 `zlib::crc32` 的结果互换。
- 它只有 32 位输出，而且 CRC 是线性的。`unordered_map` 会用原始 `uint64_t` key 再做相等性比较，所以碰撞不会造成错误，但在对手可控输入或超大数据集上，碰撞仍可能拖垮性能；它不适合作为 DoS 防护或密码学 hash。
- 若仍从字符串打包 key，要把未使用的字节清零，并把长度编码进 key；`"a"` 和 `"a\0"` 等字节序列是否应视为同一个 key，需要先定义清楚。不要直接解引用 `char*` 为 `uint64_t*`，那会碰到对齐和 strict-aliasing 问题；用 `memcpy` 读取更稳妥。

所以它更适合「key 很短、吞吐敏感、输入可信，并且基准测试证明 bucket 分布确实是瓶颈」的场景。若默认的 `std::hash<uint64_t>` 已经让负载均匀，额外算 CRC 反而只是在增加一条指令和可移植性成本；优化前后都应以真实 key 分布做 benchmark。

此外，你也可以考虑采取其它实现方式的map，比如这里有位大神总结的[Comprehensive C++ Hashmap Benchmarks 2022](https://martin.ankerl.com/2022/08/27/hashmap-bench-01/)，根据你需要的场景，选择更合适的map，也能继续压低时延。
