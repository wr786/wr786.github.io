---
title: Multicast & IGMP
description: "IGMP 是一个网络层协议，用于在 IPv4 的网络上设置多播。

具体来说，IGMP 允许设备加入一个多播组。"
slug: Multicast_and_IGMP
date: 2023-11-03 00:00:00+0800
categories:
  - 开发杂谈
tags:
  - 网络
---

IGMP 是一个网络层协议，用于在 IPv4 的网络上设置多播。

具体来说，IGMP 允许设备加入一个多播组。

## 什么是多播（Multicast）？

多播使得一个应用可以仅仅发送一个数据包，就能让网络中的一组 host 都收到，就像群发邮件一样。

多播通过在多个设备之间共享 IP 地址来运作。指向该 IP 地址的任何网络流量都将到达共享该 IP 地址的所有设备。

因为多播是一对多的，所以只能用类似 SOCK_DGRAM 的 socket，而不能用 SOCK_STREAM。

## IGMP 如何运作？

连接到网络的计算机和其他设备在想要加入多播组时使用 IGMP。支持 IGMP 的路由器侦听来自设备的 IGMP 传输，以确定哪些设备属于哪些多播组。

IGMP 使用为多播预留的 IP 地址。多播 IP 地址在 224.0.0.0 和 239.255.255.255 之间的范围内（即D类网段）。并被分为

- 局部多播地址：在 224.0.0.0～224.0.0.255 之间，这是为路由协议和其他用途保留的地址，路由器并不转发属于此范围的 IP 包。
- 预留多播地址：在 224.0.1.0～238.255.255.255 之间，可用于全球范围（如 Internet ）或网络协议。
- 管理权限多播地址：在 239.0.0.0～239.255.255.255 之间，可供组织内部使用，类似于私有IP地址，不能用于 Internet，可限制多播范围。

每个多播组共享其中一个 IP 地址。当路由器接收到一系列指向该共享 IP 地址的数据包时，它将复制这些数据包，将副本发送给多播组的所有成员。
IGMP 多播组可以随时更改。设备可以在任何时候发送 IGMP “加入组”或“离开组”消息。IGMP 不限成员数量和位置。

## 使用

### 命令行

**加入指定多播组**

```bash
sudo ip addr add 233.54.12.234/32 dev eth1 autojoin
```
或者

```bash
socat STDIO UDP4-RECV:22001,ip-add-membership=233.54.12.234:eth1 > /dev/null
```
**查看加入了哪些多播组**
```bash
netstat -gn
```

### 程序

setsockopt()参数

1. IP_ADD_MEMBERSHIP:  加入指定多播组
2. IP_DROP_MEMBERSHIP:  退出指定多播组
3. IP_MULTICAST_IF: 设置将要发出multicast包的interface
4. IP_MULTICAST_TTL:  设置发出的multicast包的TTL，默认TTL为1。
5. IP_MULTICAST_LOOP:  设置是否要将发出的multicast包也发给发送者，如果发送者也是那个多播组的一员。

具体使用可见：https://tldp.org/HOWTO/Multicast-HOWTO-6.html

一般要写一个收/发multicast的程序，需要：

1. 建立一个socket。
2. 设置多播的参数，例如超时时间TTL、本地回环许可LOOP等。（纯接收的话不用设置）
3. 加入多播组。
4. 发送或接收数据。
5. 退出多播组。

## Multicast Without IGMP

在实际使用中，我们发现，在有些机器上，即使我们没有加入多播组，也能收到多播信息。

这是由于接收者和发送源在**同一内网**下，所以不需要加入多播组就能收到multicast。

## 参考
- https://www.cloudflare.com/zh-cn/learning/network-layer/what-is-igmp/
- https://www.tenouk.com/Module41c.html
- https://unix.stackexchange.com/questions/140384/creating-multicast-join-for-tcpdump-captures
- https://superuser.com/questions/425665/multicast-streaming-without-igmp