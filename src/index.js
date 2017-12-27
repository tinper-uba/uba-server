/* uba v3
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-12-22 23:31:04
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2017-12-23 11:59:36
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
const portfinder = require("portfinder");
const webpackConfig = require("./pack");
const compiler = webpack(webpackConfig);


/**
 * dev server 主程序
 */
server = opt => {
  //加载插件
  util.loadPlugins(app);
  //打开浏览器
  compiler.apply(new OpenBrowserPlugin({
    url: `http://${opt.ip}:${opt.port}`
  }));
  //静态编译
  const instance = devMiddleware(compiler, {
    logTime: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Uba-Server": util.getPkg().version
    },
    stats: {
      colors: true
    }
  });
  //加载实例
  app.use(instance);
  //热更新
  app.use(hotMiddleware(compiler));

  //运行调试服务
  app.listen(opt.port, () => {
    console.log();
    console.log(chalk.green(`********************************************`));
    console.log(chalk.yellow(` ❤️  uba-webpack-koa2-server`));
    console.log(chalk.green(` [uba server]: v${util.getPkg().version}`));
    console.log(chalk.green(` [local]     : http://127.0.0.1:${opt.port}`));
    console.log(chalk.green(` [lan]       : http://${opt.ip}:${opt.port}`));
    console.log(chalk.green(`********************************************`));
    console.log();
  });
}


//插件启动
module.exports = {
  //主程序uba调用插件Context
  plugin: (context) => {
    //设置默认端口
    portfinder.basePort = 4000;
    //检测是否被占用，更换端口，启动调试服务
    portfinder.getPortPromise().then((port) => {
      server({
        port,
        ip: ip.address()
      });
    }).catch((err) => {
      console.log(chalk.red(err))
    });
  }
}
