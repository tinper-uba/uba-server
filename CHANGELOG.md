# CHANGELOG

### version 2.1.1

1. 锁定包版本，防止第三方插件出现自动升级导致BUG

### version 1.2.1

1. 增加`homepage`参数，默认打开的页面相对路径
2. 增加`opts`用于暴露内部代理插件`http-proxy-middleware`的参数
3. 修改启动服务后默认打开浏览器的URL地址为127.0.0.1
4. 解决`historyApiFallback`不传入报错的问题

### version 1.2.0

1. 增加地址重写参数`pathRewrite`

### version 1.1.9

1. 增加代理参数headers用于设置Proxy Server请求头参数

### version 1.1.8

1. 增加指定mock文件夹去访问静态资源

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
