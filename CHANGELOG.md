# CHANGELOG

### verison 1.1.7

1. 解决之前静态服务`staticConfig`冲突导致的问题现已修复

### version 1.1.6

1. 端口冲突检测中间件在个别windows7系统上会出错的问题

### version 1.1.5

1. 集成`open-browser-webpack-plugin`插件，自动判断域名和端口打开。
2. 解决指定IP和端口设置不灵活导致启动服务绑定IP问题，如：`localhost`、`127.0.0.1`、`10.6.242.173`均可访问。
3. 优化代码逻辑。

### version 1.0.0

1. 端口冲突的话`uba-server`会自动更换端口。
2. 同时支持`mock server`和`proxy server`加载，优先级`Page` > `Mock` > `Proxy`。
3. 更新核心中间件版本`webpack-dev-middleware`。
4. 为后面`uba-server-xxx`插件机制初版构思。

### version 0.0.22

1. 更换`webpack 2.7.0`解决`webpack3`调试服务慢的问题。

### version 0.0.1 - 0.0.21

1. 解决微内核多插件的机制实现初版代码发布。
