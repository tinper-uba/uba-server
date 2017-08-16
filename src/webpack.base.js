var path = require("path");
var chalk = require("chalk");
var merge = require("webpack-merge");

var ubaConfig;



try {
  ubaConfig = require(path.resolve(".","uba.config.js")).devConfig;
} catch (e) {
  console.log(chalk.red(e));
  console.log("[uba] Please check the configuration file");
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
