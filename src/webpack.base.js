var path = require("path");
var chalk = require("chalk");
var webpack = require("webpack");
var merge = require("webpack-merge");

var ubaConfig;



try {
  ubaConfig = require(path.resolve(".","uba.config.js")).devConfig;
} catch (e) {
  console.log(chalk.red(e));
  // console.log(chalk.red("[Error]:The \'uba.config.js\' configuration file was not found"));
  process.exit(0);
} finally {

}



var baseConfig= {
  entry: {

  },
  output: {

  },
  module: {
    rules: []
  },
  plugins: []
}


module.exports = merge(baseConfig, ubaConfig);
