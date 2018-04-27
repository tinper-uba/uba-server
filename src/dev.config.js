/**
 * @description develop
 */

const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const util = require('./util');
const base = require('./base.config');
const cfg = util.getUbaConfig()();

const config = {
  devtool: cfg.devtool ? cfg.devtool : "cheap-module-eval-source-map",
  mode: 'development',
  output: cfg.output,
  externals: cfg.externals,
  resolve: cfg.resolve,
  module: {
    rules: cfg.loader
  },
  plugins: [
    // new HtmlWebpackPlugin(Object.assign({
    //   template: "./src/index.html"
    // }, cfg.html)),
    new webpack.HotModuleReplacementPlugin()
  ]
}

config.plugins = config.plugins.concat(cfg.plugins);

if (cfg.appType === 'single') {
  config['plugins'].push(new HtmlWebpackPlugin(Object.assign({
    template: "./src/index.html"
  }, cfg.html)));
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
  let entries = {};
  config['entry'] = {};
  glob.sync(cfg.entry).forEach(path => {
    const chunk = path.split("./src/pages/")[1].split("/index.js")[0];
    entries[`${chunk}`] = [path, require.resolve('./hot-middleware/client')];
    let htmlConfig = {
      template: `./src/pages/${chunk}/index.html`,
      chunks: ['manifest', 'vendor', 'test', chunk],
      chunksSortMode: "manual",
      filename: `${chunk}.html`
    };
    config['plugins'].push(new HtmlWebpackPlugin(Object.assign(htmlConfig, cfg.html)));
  });
  config['entry'] = entries;
}


module.exports = merge(base, config);
