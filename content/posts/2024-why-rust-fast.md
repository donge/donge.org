---
title: Rust为什么快？
date: 2024-06-04T01:00:00+08:00
draft: false
---


## 快在哪里?

Rust很擅长JSON处理，serdes，各种RPC格式转换，正则表达式匹配处理，语法意义处理，parser。
基本没有对手，而在其他场景，大家相差不大。这是为什么？

我猜想这绝对是Rust独特内存特性造成的。以上场景处理上需要对内存做比较零散的操作，比如一个消息块的大小，然后解析处理，完成后再处理下一块，只对处理中间状态有保持，无需一直持有所以消息在内存。

这种零散的内存操作在Rust中会通过所有权机制优化到栈上完成，这相对其他语言减少很多堆内存分配与引用开销，还可以利用寄存器指令缓存。其他语言甚至没有机制优化到zero allocation或相同水平，go这种内存GC类语言就更吃亏。

而对于大内存的处理语言都借助于内存池或Arena，减少栈开销，这种场景下并没有差距，GC也没关系。

## 不快在哪里?

对于其他性能场景，如计算密集，编译型>jit>解释型，Rust并不突出，甚至在科学计算或训练时，计算被替换成了io，用什么语言都不关键了。

io密集下的快，语言的调度，并发，事件机制，锁机制重要，用得对更重要。

所以在不讨论Rust的内存安全vs开发效率时，Rust该用来干什么，而不是无脑rewrite，希望对大家有启发。

## 脑洞

结束又想到一个脑洞，Rust这种特长很像LLM拥有很长的上下文（栈），而不需要用向量数据库查（堆）。未来计算体系结构如果有更大的栈，更多的寄存器空间，Rust的内存魔法也许会更强。