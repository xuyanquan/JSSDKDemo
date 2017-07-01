# 项目结构

### 环境准备
1. node gulp npm 安装
2. 安装 npm install 或者 使用淘宝镜像 cnpm install
3. 命令行 `gulp` 启动环境

### 目录结构
> JSSDKDemo 本地开发访问根目录localhost:3000

>> demo 开发调试静态页面文件
>>
>> dist 本地开发编译目录与访问目录
>> 
>> lib 第三方库源代码
>> 
>> node_modules npm依赖包
>> 
>> online 线上目录
>> 
>> src 源代码开发目录
>>> component 公用组件
>>> 
>>> javascript 脚本代码
>>> 
>>> mcss 样式文件
>>> 
>>>> mass mcss 工具库
>>> 
>>> tpl 模板
>> 
>> test 测试目录
>> 
>> server.js 本地node服务器启动文件
>> 

### gulp 命令讲解

* ```gulp``` 启动开发，监听编译预览刷新
* ```gulp compx``` 一次编译文件
* ```gulp test``` 生成打包测试代码
* ```gulp online``` 生成打包线上代码
* ```gulp pre``` 生成打包预发代码

### 细节讲解
1. 需要打包不支持AMD/CMD模块代码，在代码中采用原样引入，比如zepto.js：```require('script!./../../lib/zepto/zepto.js');```
2. 模板引擎采用ejs。引入方式如：```require('ejs!./../tpl/****.ejs');```

### 参考文档
* NodeServer [地址](https://github.com/xuyanquan/NodeServer)
* ejs模板引擎语法使用 [地址](https://github.com/okonet/ejs-loader)
* mass使用 [地址](https://github.com/leeluolee/mass)









