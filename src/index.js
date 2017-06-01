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
var mockJS, svrConfig, proxyConfig;


try {
  mockJS = require(path.resolve(".", "mock", "mock.js"))(router);
} catch (e) {
  console.log(e);
  process.exit(0);
} finally {

}
try {
  svrConfig = require(path.resolve(".", "uba.config.js")).svrConfig;
  proxyConfig = require(path.resolve(".", "uba.config.js")).proxyConfig;

} catch (e) {
  console.log(e);
  process.exit(0);
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

function server() {

  app.use(express.static(path.resolve('.', 'mock')));
  app.use(mockJS);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    stats: {
      colors: true
    }
  }));


  proxyConfig.forEach(function(element) {
    app.use(element.router, proxy(element.url));
  });

  app.use(require("webpack-hot-middleware")(compiler));



  app.listen(svrConfig.port, svrConfig.host, function() {
    console.log(`Listening on port http://${svrConfig.host}:${svrConfig.port}`);
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
