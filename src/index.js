/* uba-server for webpack3
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2018-10-10 14:49:16
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-10-10 14:49:21
 */

var chalk = require("chalk");
var path = require("path");
var express = require("express");
var argv = require("minimist")(process.argv.slice(2));
var commands = argv;
var proxy = require("http-proxy-middleware");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var OpenBrowserPlugin = require("open-browser-webpack-plugin");
var ip = require("ip");
var util = require("./util");
var webpackConfig = util.getConfig().devConfig;
var app = express();
var router = express.Router();
var getPort = require("get-port");
var history = require("connect-history-api-fallback");
var compiler = webpack(webpackConfig);
var mockConfig, svrConfig, proxyConfig;
var ubaConfig = util.getConfig();

//读取服务器配置
svrConfig = ubaConfig.svrConfig;
//读取代理配置
proxyConfig = ubaConfig.proxyConfig;
//读取静态文件服务配置
staticConfig = ubaConfig.staticConfig;

/**
 * @description 帮助
 */
function getHelp() {
  console.log(chalk.green(" Usage : "));
  console.log();
  console.log(chalk.green(" uba server"));
  console.log();
  process.exit(0);
}

/**
 * @description 版本号
 */
function getVersion() {
  console.log(chalk.green(require("../package.json").version));
  process.exit(0);
}


/**
 * @description 调试服务
 * @param {*} opt {ip,port}
 */
function server(opt) {
  //检查是否有本地mock
  try {
    mockConfig = require(path.resolve(".", "uba.mock.js"));
  } catch (e) {
    console.log(chalk.red(e));
    console.log(chalk.yellow("[uba] Please check the uba.mock.js configuration file"));
    mockConfig = undefined;
  }
  //设置指定静态资源目录
  if (staticConfig) {
    app.use(express.static(path.resolve('.', staticConfig.folder)));
    if (staticConfig.mock) {
      app.use(express.static(path.resolve('.', staticConfig.mock)));
    }
  }
  //开始加载代理
  proxyConfig.forEach(function (element) {
    if (element.enable) {//代理开启
      //默认配置项
      let proxyOpt = {
        target: element.url,
        logLevel: "debug",
        changeOrigin: true,
        pathRewrite: Object.assign({}, element.pathRewrite),
        headers: (typeof element.headers !== 'undefined' ? element.headers : {}),
        onProxyRes: function (proxyRes) {
          proxyRes.headers["Uba-Server-Proxy"] = "true";
        }
      }
      app.use(element.router, proxy(proxyOpt));
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

  if (!commands.noOpen) {
    //集成自动开启浏览器插件
    compiler.apply(new OpenBrowserPlugin({
      url: `http://${opt.ip}:${opt.port}`
    }));
  }


  //加载webpack处理
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    logTime: true,
    logLevel: commands.logLevel || "info",
    headers: {
      "Uba-Server": util.getPkg().version
    },
    stats: {
      colors: true,
      chunks: !commands.chunks
    }
  }));
  //模块热替换
  app.use(require("webpack-hot-middleware")(compiler));
  //启动调试服务
  app.listen(opt.port, function () {
    console.log();
    console.log(chalk.green(`********************************************`));
    console.log(chalk.yellow(` ❤️  uba-develop-server`));
    console.log(chalk.green.bold(` [core] : v${util.getPkg().version}`));
    console.log(chalk.green.bold(` [http] : http://127.0.0.1:${opt.port}`));
    console.log(chalk.green.bold(` [http] : http://${opt.ip}:${opt.port}`));
    console.log(chalk.green(`********************************************`));
    console.log();
  });


}

module.exports = {
  /**
   * @description 启动插件
   */
  plugin: function (options) {
    cmd = options.cmd;
    pluginname = options.name;
    //--help
    if (options.argv.h || options.argv.help) {
      getHelp();
    }
    //--help
    if (options.argv.v || options.argv.version) {
      getVersion();
    }
    //获得本机IP
    var localIP = ip.address();
    //设置默认端口
    getPort({
      port: commands.port || 3000
    }).then(port => {
      //启动服务
      server({
        port,
        ip: localIP
      });
    });
  }
}
