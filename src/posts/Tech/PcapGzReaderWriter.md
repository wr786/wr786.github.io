---
title: '.pcap.gz [Reader|Writer]'
icon: material-symbols:article
date: 2024-04-04
category:
  - 开发杂谈
tag:
  - 后端
  - C++
  - 网络
  - 文件读写
sticky: false
star: false
---

如果有抓包或者读取抓包的需求，那肯定会用到 .pcap 。

而包实在是太多了！用.pcap不仅很占空间，而且因此会导致传输速度很慢。那么自然就想到了压缩。

而如果每次都是压缩或解压，那实在是太慢而且太累了！

所以我们可以结合 zlib 与 pcap，写一个能够直接读写 .pcap.gz 的类！

<!-- more -->

首先，我们需要以文件流的形式打开一个 .gz 文件，并且进行各种文件流读写操作。

`cookie_io_functions_t` 是一个在C语言中的结构体，它被用于定义一组函数指针，这些函数指针用于自定义对文件流的读写操作。

于是我们可以这样：
```cpp
// 这部分代码来源：
// https://stackoverflow.com/questions/69456736/read-zst-compressed-pcap-with-libpcap

ssize_t gzip_cookie_read(void* cookie, char* buf, std::size_t size) { 
    return ::gzread(reinterpret_cast<gzFile>(cookie)，buf, size);
}
ssize_t gzip_cookie_write(void* cookie, const char* buf, std::size_t size) {
    return ::gzwrite(reinterpret_cast<gzFile>(cookie), buf, size);
}
int32_t gzip_cookie_seek(void* cookie, off64_t* off, int32_t whence) {
    z_off_t rv = ::gzseek( reinterpret_cast<gzFile>(cookie), *off, whence);
    if(rv >= 0) { 
        *off = rv;
        return 0;
    }
    return -1;
}
int32_t gzip_cookie_close(void* cookie) {
    return ::gzclose(reinterpret_cast<gzFile>(cookie));
}

cookie_io_functions_t
gzip_cookie_functions =
{ .read  = gzip_cookie_read
, .write = gzip_cookie_write
, .seek  = gzip_cookie_seek
, .close = gzip_cookie_close
} ;
```

打开 .gz 文件只是第一步，要知道我们不仅需要它是 .gz ，还需要它是 .pcap ！那么怎么做呢？

对于文件读写来说，一般分为
1. 打开文件
2. 读/写文件
3. 关闭文件

所以我们这里也分这三种来分别探讨一下写法。

顺便这里是一些类型：

```cpp
pcap_t* handler_ = nullptr;
pcap_dumper_t* pcap_dumper_ = nullptr;
```

首先是打开文件和关闭文件，让我们先看看代码。

```cpp
void PcapGzReader::Close() noexcept {
    if (handler_ != nullptr) {
        ::pcap_close(handler_);
        handler_ = nullptr;
    }
}

bool PcapGzReader::Open(const char* file_name) noexcept {
    Close();
    char err_buf[PCAP_ERRBUF_SIZE + 1];
    std::memset(err_buf, 0, sizeof(err_buf));
    gzFile gzf = ::gzopen(filename, "r");
    if (gzf == Z_NULL) {
        return false;
    }
    // Convert gzFile handler to FILE pointer w/ same underlying stream.
    FILE* pcfp = ::fopencookie(gzf, "r", PcapGz::gzip_cookie_functions);
    if (pcfp == nullptr) {
        return false;
    }
    
    handler_ = ::pcap_fopen_offline_with_tstamp_precision(
        pcfp,
        PCAP_TSTAMP_PRECISION_NANO,
        err_buf
    );
    if (handler_ == nullptr) {
        return false;
    }
    return true;
}
```

```cpp
void PcapGzWriter::Close() noexcept {
    if (pcap_dumper_) {
        pcap_dump_close(pcap_dumper_);
        pcap_dumper_ = nullptr;
    }
    if (handler_) {
        pcap_close(handler_);
        handler_ = nullptr;
    }
}

bool PcapGzWriter::Open(
    const char* file_name,
    u_int precision,
    int link_type,
    int snap_len
) noexcept {
    Close();
    char err_buf[PCAP_ERRBUF_SIZE + 1];
    std::memset(err_buf, 0, sizeof(err_buf));
    gzFile gzf = ::gzopen(filename, "r");
    if (gzf == Z_NULL) {
        return false;
    }
    // Convert gzFile handler to FILE pointer w/ same underlying stream.
    FILE* pcfp = ::fopencookie(gzf, "r", PcapGz::gzip_cookie_functions);
    if (pcfp == nullptr) {
        return false;
    }
    
    handler_ = ::pcap_open_dead_with_tstamp_precision(link_type, snap_len, precision);
    if (handler_ == nullptr) {
        return false;
    }
    
    pcap_dumper_ = pcap_dump_fopen(handler_, pcfp);
    assert(pcap_dumper_ != nullptr);
    return true;
}
```

可以看到，对于读文件和写文件，前戏都是相同的。都是通过 fopencookie，打开 .gz 文件流，让我们的 pcap 读写能力从 .gz 文件流里进行读写，从而就可以像 .pcap 一样操作。

于是我们就可以这样进行读：

```cpp
const u_char* PcapGzReader::Read(pcap_pkthdr& header) noexcept {
    if (UNLIKELY(!handler_ && !OpenNext())) {
        return nullptr;
    }
    auto ret = pcap_next(handler_, &header);
    while (UNLIKELY(ret == nullptr)) {
        if (!OpenNext()) {
            return nullptr;
        }
        ret = pcap_next(handler_, &header);
    }
    return ret;
}
```

这里 `OpenNext()` 是一个能够自动开启下一个文件读取的函数，这里就不进行展示了，总之很简单对吧？写的操作更简单！

```cpp
void PcapGzWriter::Write(pcap_pkthdr& header, void* buffer) noexcept {
    pcap_dump(
        (u_char*)(pcap_dumper_),
        &header,
        (const u_char*)(buffer)
    );
}
```

没错，就是直接用 libpcap 的函数写，正如前面所说，我们将 .gz 打开成文件流之后就可以当作 .pcap 进行处理了。

那么看到这里，你已经能写出一个 .pcap.gz 的 Reader / Writer 了。不过这个打开 .gz 成文件流的操作，应该能扩展到其他更多 .xxx.gz 文件的 Reader / Writer ……