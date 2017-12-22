/* uba v3
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-12-22 23:31:04
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2017-12-22 23:36:43
 */

const util = require("./util");
const chalk = require("chalk");
const Koa = require("koa");
const app = new Koa();
const webpack = require("webpack");
const devMiddleware = require("koa-uba-dev-middleware");
const hotMiddleware = require("koa-uba-hot-middleware");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
const ip = require("ip");
const webpackConfig = util.getUbaConfig();


/**
 * dev server 主程序
 */
function server() {
  webpackConfig.plugins.push(new OpenBrowserPlugin({
    url: `http://127.0.0.1:4000`
  }));
  let compiler = webpack(webpackConfig);
  //静态编译
  app.use(devMiddleware(compiler, {
    stats: {
      colors: true
    }
  }));
  //热更新
  app.use(hotMiddleware(compiler));
  //运行调试服务
  app.listen(4000, () => {
    console.log(chalk.green("[uba] : dev server start up"))
  });
}

module.exports = {
  plugin: function (options) {
    server();
  }
}
