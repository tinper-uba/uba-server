var chalk = require("chalk");
var path = require("path");
var os = require("os");

var express = require("express");
var proxy = require('express-http-proxy');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.base");


var app = express();
var router = express.Router();
var compiler = webpack(webpackConfig);
var mockJS,mockConfig, svrConfig, proxyConfig,staticConfig;
var isMac = os.platform() == "darwin" ? true : false;


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
  staticConfig = require(path.resolve(".", "uba.config.js")).staticConfig;
  mockConfig = require(path.resolve(".", "uba.mock.js"));

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
  app.use(express.static(path.resolve('.', staticConfig.folder)));
  if(proxyConfig.length!=0){
    if(!proxyConfig[0].enable){
        if(mockConfig["GET"]){
    for (let i = 0; i < mockConfig["GET"].length; i++) {
      for (let item in mockConfig["GET"][i]) {
        //console.log(item);
        //console.log(mockConfig["GET"][i][item]);
        console.log(`【Mock GET】 :load mockRouter [${item}] to ${mockConfig["GET"][i][item]}`);
        router.get(item, function(req, res, next) {
          res.sendFile(path.resolve(".",mockConfig["GET"][i][item]),{
            headers : {
              "mockServer" : "uba"
            }
          });
        });
      }
    }
  }
  if(mockConfig["POST"]){
    for (let i = 0; i < mockConfig["POST"].length; i++) {
      for (let item in mockConfig["POST"][i]) {
        // console.log(item);
        // console.log(mockConfig["POST"][i][item]);
        console.log(`【Mock POST】:load mockRouter [${item}] to ${mockConfig["POST"][i][item]}`);
        router.post(item, function(req, res, next) {
          res.sendFile(path.resolve(".",mockConfig["POST"][i][item]),{
            headers : {
              "mockServer" : "uba"
            }
          });
        });
      }
    }
  }
     app.use(router);
    }
  }
   app.use(mockJS);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    stats: {
      colors: true
    }
  }));


  proxyConfig.forEach(function(element) {
    if(element.enable){
      app.use(element.router, proxy(element.url));
    }
  });

  app.use(require("webpack-hot-middleware")(compiler));

  //console.log(mockConfig["GET"]);

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
