# 云开发·云调用生成小程序码

使用到了云开发中的云函数、云存储、云调用

根据请求参数生成小程序码，并保存到云存储，返回临时链接。
保存时文件名为请求参数的摘要，同样的参数再次请求可以直接返回已存储小程序码。

注意**已发布**小程序才能生成小程序码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

