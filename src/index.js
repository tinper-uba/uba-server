/* uba server 2.0.0
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2018-04-23 15:28:04
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-04-25 14:02:58
 */

const util = require('./util');
const chalk = require('chalk');
const express = require('express');
const app = new express();
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ip = require('ip');
const getPort = require('get-port');
const webpackConfig = require('./webpack.dev.config');
const compiler = webpack(webpackConfig);


/**
 * server 主程序
 */
server = opt => {
  //打开浏览器
  compiler.apply(new OpenBrowserPlugin({
    url: `http://${opt.ip}:${opt.port}`
  }));
  //静态编译
  const instance = devMiddleware(compiler, {
    logTime: true,
    logLevel: 'info',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Uba-Server': util.getPkg().version
    },
    stats: {
      colors: true,
      hash: false,
      children: false,
      chunks: false
    }
  });
  //加载实例
  app.use(instance);
  //热更新
  app.use(hotMiddleware(compiler));

  //加载插件
  util.loadPlugins(app);

  //运行调试服务
  app.listen(opt.port, () => {
    console.log();
    console.log(chalk.green(`********************************************`));
    console.log(chalk.yellow(` ❤️  uba develop server`));
    console.log(chalk.green(` [uba server]: v${util.getPkg().version}`));
    console.log(chalk.green(` [local]     : http://127.0.0.1:${opt.port}`));
    console.log(chalk.green(` [lan]       : http://${opt.ip}:${opt.port}`));
    util.showPluginInfo();
    console.log(chalk.green(`********************************************`));
    console.log();
  });
}

//插件启动
module.exports = {
  //主程序uba调用插件Context
  plugin: (context) => {
    //设置默认端口
    //检测是否被占用，更换端口，启动调试服务
    getPort({
      port: 3000
    }).then(port => {
      //启动服务
      server({
        port,
        ip: ip.address()
      });
    });
  }
}
