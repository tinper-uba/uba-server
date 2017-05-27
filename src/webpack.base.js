var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");

var ubaConfig;



try {
  ubaConfig = require(path.resolve(".","uba.config.js"))();
} catch (e) {
  console.log(" Error : not found \'uba.config.js\' file.");
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
