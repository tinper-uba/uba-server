/**
 * @description develop
 */

const path = require('path');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const util = require('./util');
const base = require('./webpack.base.config');
const cfg = util.getUbaConfig()();

const config = {
  devtool: "cheap-module-eval-source-map",
  mode: 'development',
  //app: ['./src/app.jsx', require.resolve('./hot-middleware/client')]
  externals: Object.assign({}, cfg.externals),
  plugins: [
    new HtmlWebpackPlugin(Object.assign({
      template: "./src/index.html"
    }, cfg.html)),
    new webpack.HotModuleReplacementPlugin()
  ]
}

if (cfg.appType === 'single') {
  switch (Object.prototype.toString.call(cfg.entry)) {
    case '[object Array]':
      config['entry'] = cfg.entry.concat([require.resolve('./hot-middleware/client')]);
      break;
    case '[object String]':
      config['entry'] = [cfg.entry, require.resolve('./hot-middleware/client')];
      break;
    case '[object Object]':
      config['entry'] = {};
      for (let i = 0; i < Object.keys(cfg.entry).length; i++) {
        let key = Object.keys(cfg.entry)[i];
        let value = Object.values(cfg.entry)[i];
        if (Object.prototype.toString.call(value) == '[object Array]') {
          config['entry'][key] = value.concat([require.resolve('./hot-middleware/client')]);
        } else {
          config['entry'][key] = [value, require.resolve('./hot-middleware/client')];
        }
      }
      break;
    default:
      config['entry'] = {};
      break;
  }
} else if (cfg.appType === 'multi') {

}

console.log(config);

process.exit(0);
module.exports = merge.smart(base, config);
