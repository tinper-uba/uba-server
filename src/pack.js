const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
const util = require("./util");


const base = {
  output: {
    filename: '[name].[hash:8].js'
  },
  resolve: {
    extensions: [
      ".jsx",
      ".js"
    ],
    alias: {
      components: path.resolve(__dirname, "src/components/")
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ["css-loader","postcss-loader"]
      })
    }, {
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      //   include: path.resolve("src"),
      use: ["babel-loader"]
    }]
  },
  plugins: [
    //优化共享CommonChunk
    new webpack.optimize.CommonsChunkPlugin({
      name: "verdor",
      filename: "[name].[hash:8].js"
    }),
    //加载进度条
    new webpack.ProgressPlugin(),
    //Chunk相对路径
    new webpack.NamedModulesPlugin(),
    //热更新插件
    new webpack.HotModuleReplacementPlugin(),
    //HTML插件
    new HtmlWebpackPlugin({
      xhtml: true,
      inject: "body",
      hash: true,
      filename: 'index.html',
      template: "./view/index.html"
    }),
    //提取CSS
    new ExtractTextPlugin("[name].[hash:8].css")
  ]
}
console.log(util.getUbaConfig().config);
module.exports = merge.smart(base, util.getUbaConfig().pack);
