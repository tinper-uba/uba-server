<img src="http://tinper.org/assets/images/uba.png" width="120" />

# uba-server

[![npm version](https://img.shields.io/npm/v/uba-server.svg)](https://www.npmjs.com/package/uba-server)
[![devDependency Status](https://img.shields.io/david/dev/tinper-uba/uba-server.svg)](https://david-dm.org/tinper-uba/uba-server#info=devDependencies)
[![NPM downloads](http://img.shields.io/npm/dt/uba-server.svg?style=flat)](https://npmjs.org/package/uba-server)



## 介绍

基于[uba](https://github.com/iuap-design/tinper-uba/blob/master/README_zh-CN.md)集成开发工具扩展的插件，具有服务启动、开发调试、代理访问、数据模拟、热更新、自动打开浏览器的功能。

# CHANGELOG


### version 1.0.0

1. 端口冲突的话`uba-server`会自动更换端口。
2. 同时支持`mock server`和`proxy server`加载，优先级`Page` > `Mock` > `Proxy`。
3. 更新核心中间件版本`webpack-dev-middleware`。
4. 为后面`uba-server-xxx`插件机制初版构思。

### version 0.0.22

1. 更换`webpack 2.7.0`解决`webpack3`调试服务慢的问题。

### version 0.0.1 - 0.0.21

1. 解决微内核多插件的机制实现初版代码发布。
