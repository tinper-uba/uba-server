/* webpack base config v3
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-12-22 23:31:04
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2017-12-25 13:51:35
 */

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require("webpack-merge");
const util = require("./util");
const cfg = util.getUbaConfig().config;

const base = {
  entry : {},
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
        use: ["css-loader", "postcss-loader"]
      })
    }, {
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      //   include: path.resolve("src"),
      use: ["babel-loader"]
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [
          "css-loader", "postcss-loader", "less-loader"
        ],
        fallback: "style-loader"
      })
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: "url-loader",
        options: cfg.img
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: "file-loader",
        options: cfg.img
      }]
    }]
  },
  plugins: [
    //加载进度条
    new webpack.ProgressPlugin(),
    //Chunk相对路径
    new webpack.NamedModulesPlugin(),
    //热更新插件
    new webpack.HotModuleReplacementPlugin(),
    //HTML插件
    new HtmlWebpackPlugin(cfg.html),
    //提取CSS
    new ExtractTextPlugin(cfg.css.name),
    //优化公共代码
    new webpack.optimize.CommonsChunkPlugin(cfg.js)
  ]
}
//优化共享CommonChunk
if(cfg.js.optimize && util.getVendors().length){
  base.entry["vendor"] = util.getVendors();
};
//压缩插件
cfg.js.min && base.plugins.push(new UglifyJsPlugin(cfg.js.opt));

module.exports = merge.smart(base, util.getUbaConfig().pack);
