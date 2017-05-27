var chalk = require("chalk");
var path = require("path");

var express = require("express");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.base");


var app = express();
var compiler = webpack(webpackConfig);





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
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    stats: {
      colors: true
    }
  }));
  app.use(require("webpack-hot-middleware")(compiler));

  app.listen(3000, function() {
    console.log("Listening on port 3000!");
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
