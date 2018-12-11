--- 
title: 营销活动
---

### 使用说明

- 先安装node环境，[node官网](https://nodejs.org/en/download/)，选择合适的系统。

- 项目初始化
```bash
# 到项目根目录执行
npm install
```

### 主要利用webpack实现功能

- init，初始化一个活动
```
NAME="filename" npm run init
```
1. mkdir "filename"
2. copy template
3. index.html add static source path

- start，打开活动所对应的服务
```
NAME="filename" npm run start
```
1. start webpack-dev-server
2. set proxy

- build，打包构建
```
NAME="filename" npm run build
```
1. babel es6 convert es5, postcss
2. package
3. compress

### 需要注意

如需上线，图片需要用TinyPNG进行压缩，地址 ![https://tinypng.com/](https://tinypng.com/)


如需用到特殊字体，需要用`font-spider`进行压缩，先要修改index.html里font引入的路径。font-spider只能解析静态页面路径，不能解析起了`weboack-dev-server`的路径。这里需要注意。

```bash
sudo font-spider ./demo/*.html
```

例如
```
sudo font-spider --debug src/modules/mgday2018/index.html
```
