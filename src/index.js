/*
 * @Author: Kvkens
 * @Date:   2017-5-15 00:00:00
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2017-08-16 14:22:42
 */

var chalk = require("chalk");
var path = require("path");
var express = require("express");
var proxy = require('express-http-proxy');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.base");
var app = express();
var router = express.Router();
var compiler = webpack(webpackConfig);
var mockConfig, svrConfig, proxyConfig, staticConfig;
var ubaConfig = require(path.resolve(".", "uba.config.js"));

try {
  //读取服务器配置
  svrConfig = ubaConfig.svrConfig;
  //读取代理配置
  proxyConfig = ubaConfig.proxyConfig;
  //读取静态资源配置
  staticConfig = ubaConfig.staticConfig;
} catch (e) {
  console.log(chalk.red(e));
  process.exit(0);
} finally {

}

try {
  mockConfig = require(path.resolve(".", "uba.mock.js"));
} catch (e) {
  console.log(chalk.red(e));
  console.log("[uba] Please check the configuration file");
  mockConfig = undefined;
} finally {

}



function getHelp() {
  console.log(chalk.green(" Usage : "));
  console.log();
  console.log(chalk.green(" uba server"));
  console.log();
  process.exit(0);
}

function getVersion() {
  console.log(chalk.green(require("../package.json").version));
  process.exit(0);
}

function isEnableProxy() {
  let isBreak = false;
  for (let i = 0; i < proxyConfig.length; i++) {
    if (proxyConfig[i].enable) {
      isBreak = true;
      break;
    }
  }
  return isBreak;
}


//开发调试总程序
function server() {
  //设置默认mock
  app.use(express.static(path.resolve('.', 'mock')));
  //设置指定静态资源目录
  app.use(express.static(path.resolve('.', staticConfig.folder)));
  //判断是否启用mock
  if (isEnableProxy()) {
    console.log(chalk.yellow("\n/******************** Start loading proxy server ********************/\n"));
    proxyConfig.forEach(function(element) {
      if (element.enable) {
        app.use(element.router, proxy(element.url, element.options));
        console.log(chalk.green(`[proxy] : ${element.router} to ${element.url}`));
      }
    });
    console.log(chalk.yellow("\n/******************** Proxy server loaded completed *****************/\n"));
  } else {
    console.log(chalk.yellow("\n/******************** Start loading mock server ********************/\n"));
    for (let item in mockConfig) {
      for (let i = 0; i < mockConfig[item].length; i++) {
        for (let url in mockConfig[item][i]) {
          console.log(chalk.green(`[mock]:[${url}] to ${mockConfig[item][i][url]}`));
          router.all(url, function(req, res, next) {
            console.log(chalk.green(`[mock]: ${req.method} ${req.ip} client router [${url}]-[${mockConfig[item][i][url]}]`));
            res.sendFile(path.resolve(".", mockConfig[item][i][url]), {
              headers: {
                "uba-server": require("../package.json").version
              }
            });
          });
        }
      }
    }
    console.log(chalk.yellow("\n/******************** Mock server loaded completed *****************/\n"));
    app.use(router);
  }


  // console.log("exit");
  // process.exit(0);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    stats: {
      colors: true
    }
  }));

  app.use(require("webpack-hot-middleware")(compiler));

  app.listen(svrConfig.port, svrConfig.host, function() {
    console.log(chalk.yellow("\n/******************** Start dev server *****************/\n"));
    console.log(chalk.green(`[uba] : Listening on port http://${svrConfig.host}:${svrConfig.port}`));
    console.log(chalk.yellow("\n/******************** O(∩_∩)O *****************/\n"));
  });

}

module.exports = {
  plugin: function(options) {
    commands = options.cmd;
    pluginname = options.name;
    if (options.argv.h || options.argv.help) {
      getHelp();
    }
    if (options.argv.v || options.argv.version) {
      getVersion();
    }
    server();
  }
}
