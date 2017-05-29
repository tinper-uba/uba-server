var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");

var ubaConfig;



try {
  ubaConfig = require(path.resolve(".","uba.config.js")).devConfig;
} catch (e) {
  console.log(e);
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
