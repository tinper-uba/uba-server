# uba-server

[![npm version](https://img.shields.io/npm/v/uba-server.svg)](https://www.npmjs.com/package/uba-server)
[![devDependency Status](https://img.shields.io/david/dev/tinper-uba/uba-server.svg)](https://david-dm.org/tinper-uba/uba-server#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dt/uba-server.svg?style=flat)](https://npmjs.org/package/uba-server)

---

[![NPM](https://nodei.co/npm/uba-server.png)](https://nodei.co/npm/uba-server/)

---

## 介绍

基于 [uba](https://github.com/iuap-design/tinper-uba/) 集成开发工具扩展的插件，通过对应的插件增强，具有服务启动、开发调试、代理访问、数据模拟、热更新功能。



## 安装

无需单独安装，安装`uba`工具内置集成。

工具是依赖在开发框架内去使用的，具体参考开发框架里的`package.json`的启动脚本命令，配合`uba.config.js`配置文件使用

```bash
$ npm install uba -g
```

## 参数

> uba server --port 4000 --noInfo --logLevel debug --chunks --noOpen

- `--noProcess` 不显示进度百分比
- `--logLevel` 日志级别，默认：info 其他为：trace,debug,info,warn,error,silent
- `--chunks` 不显示详细的chunks信息
- `--port` 服务器端口设置，默认：3000，如冲突自增1->3001
- `--noOpen` 不自动打开浏览器


