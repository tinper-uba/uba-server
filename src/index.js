/* uba-server
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-5-15 00:00:00
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-03-18 17:36:10
 */

var chalk = require("chalk");
var path = require("path");
var express = require("express");
var proxy = require("http-proxy-middleware");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var OpenBrowserPlugin = require("open-browser-webpack-plugin");
var ip = require("ip");
var util = require("./util");
var webpackConfig = util.getConfig().devConfig;
var app = express();
var router = express.Router();
var portfinder = require("portfinder");
var history = require("connect-history-api-fallback");
var compiler = webpack(webpackConfig);
var mockConfig, svrConfig, proxyConfig;
var ubaConfig = util.getConfig();


//读取服务器配置
svrConfig = ubaConfig.svrConfig;
//读取代理配置
proxyConfig = ubaConfig.proxyConfig;


try {
  mockConfig = require(path.resolve(".", "uba.mock.js"));
} catch (e) {
  console.log(chalk.red(e));
  console.log("[uba] Please check the configuration file");
  mockConfig = undefined;
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


//开发调试总程序
function server(opt) {
  //开始加载代理
  proxyConfig.forEach(function (element) {
    if (element.enable) {
      app.use(element.router, proxy({
        target: element.url,
        logLevel: "debug",
        changeOrigin: true,
        onProxyRes: function (proxyRes) {
          proxyRes.headers["Uba-Server-Proxy"] = "true";
        }
      }));
      console.log(chalk.green(`[proxy] : ${element.router} to ${element.url}`));
    }
  });

  //开始加载Mock
  for (let item in mockConfig) {
    for (let i = 0; i < mockConfig[item].length; i++) {
      for (let url in mockConfig[item][i]) {
        console.log(chalk.green(`[mock]:[${url}] to ${mockConfig[item][i][url]}`));
        router.all(url, function (req, res, next) {
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
  app.use(router);
  //设置browserHistory时
  if (svrConfig.historyApiFallback) {
    app.use(history());
  }

  compiler.apply(new OpenBrowserPlugin({
    url: `http://${opt.ip}:${opt.port}`
  }));

  //加载webpack处理
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: svrConfig.noInfo,
    logTime: true,
    headers: {
      "Uba-Server": util.getPkg().version
    },
    stats: {
      colors: true
    }
  }));
  //模块热替换
  app.use(require("webpack-hot-middleware")(compiler));
  //启动调试服务
  app.listen(opt.port, function () {
    console.log();
    console.log(chalk.green(`********************************************`));
    console.log(chalk.yellow(` ❤️  uba-dev-server`));
    console.log(chalk.green(` [core] : v${util.getPkg().version}`));
    console.log(chalk.green(` [http] : http://127.0.0.1:${opt.port}`));
    console.log(chalk.green(` [http] : http://${opt.ip}:${opt.port}`));
    console.log(chalk.green(`********************************************`));
    console.log();
  });


}

module.exports = {
  plugin: function (options) {
    commands = options.cmd;
    pluginname = options.name;
    if (options.argv.h || options.argv.help) {
      getHelp();
    }
    if (options.argv.v || options.argv.version) {
      getVersion();
    }
    //获得本机IP
    var localIP = ip.address();
    //设置默认端口
    portfinder.basePort = 3000;
    //获得可用端口
    portfinder.getPort((err, port) => {
      if (err) {
        throw err;
      }
      //启动服务
      server({
        port,
        ip: localIP
      });
    });
  }
}
