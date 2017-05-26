var path = require("path");
var webpack = require("webpack");
var merge = require("webpack-merge");
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var ubaConfig = require(path.resolve(".","uba.config.js"))();



var baseConfig= {
  entry: {
    // main: ["./app.js", hotMiddlewareScript]
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: "/"
  },
  module: {
    rules: []
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}


module.exports = merge(baseConfig, ubaConfig);
