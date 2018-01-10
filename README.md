# uba-server

[![npm version](https://img.shields.io/npm/v/uba-server.svg)](https://www.npmjs.com/package/uba-server)
[![devDependency Status](https://img.shields.io/david/dev/tinper-uba/uba-server.svg)](https://david-dm.org/tinper-uba/uba-server#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dt/uba-server.svg?style=flat)](https://npmjs.org/package/uba-server)

---

[![NPM](https://nodei.co/npm/uba-server.png)](https://nodei.co/npm/uba-server/)

---

## 介绍

基于 [uba](https://github.com/iuap-design/tinper-uba/) 集成开发工具扩展的插件，通过对应的插件增强，具有服务启动、开发调试、代理访问、数据模拟、热更新、自动打开浏览器的功能。


## 安装

无需单独安装，安装`uba`工具内置集成。

工具是依赖在开发框架内去使用的，具体参考开发框架里的`package.json`的启动脚本命令，配合`uba.config.js`配置文件使用

```bash
$ npm install uba -g
```

本身调试插件没有其他功能，只是读取配置开启调试服务，使用开发插件才是更强大的功能

## 插件




npm | name
---|---
[![npm version](https://img.shields.io/npm/v/uba-server-mock.svg)](https://www.npmjs.com/package/uba-server-mock) | uba-server-mock
[![npm version](https://img.shields.io/npm/v/uba-server-proxy.svg)](https://www.npmjs.com/package/uba-server-proxy) | uba-server-proxy
[![npm version](https://img.shields.io/npm/v/uba-server-static.svg)](https://www.npmjs.com/package/uba-server-static) | uba-server-static


