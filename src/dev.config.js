/**
 * @description develop
 */

const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const argv = require("minimist")(process.argv.slice(2));
const commands = argv;
const util = require('./util');
const base = require('./base.config');
const cfg = util.getUbaConfig()();

//默认的配置用于merge操作
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
    new webpack.HotModuleReplacementPlugin()
  ]
}

//传入插件设置
!commands.noProcess && config.plugins.push(new webpack.ProgressPlugin());
config.plugins = config.plugins.concat(cfg.devPlugins);

//当前应用模式 单页
if (cfg.appType === 'single') {
  //设置一次HTML插件
  config['plugins'].push(new HtmlWebpackPlugin(Object.assign({
    template: "./src/index.html"
  }, cfg.html)));
  //处理不同类型的入口模式
  switch (Object.prototype.toString.call(cfg.entry)) {
    //数组的形式：entry : ['./src/app.js']
    case '[object Array]':
      config['entry'] = cfg.entry.concat([require.resolve('./hot-middleware/client')]);
      break;
      //字符串形式：entry : './src/app.js'
    case '[object String]':
      config['entry'] = [cfg.entry, require.resolve('./hot-middleware/client')];
      break;
      //对象形式：entry : { app:'./src/app.js',common:['react','react-dom'] }
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
} else if (cfg.appType === 'multi') { //多页模式
  let entries = {};
  config['entry'] = {};
  //按照传入glob参数匹配扫描
  glob.sync(cfg.entry).forEach(path => {
    const chunk = path.split("./src/pages/")[1].split("/index.js")[0];
    entries[`${chunk}`] = [path, require.resolve('./hot-middleware/client')];
    let htmlConfig = {
      template: `./src/pages/${chunk}/index.html`,
      chunks: ['manifest', 'vendor', 'commons', chunk],
      chunksSortMode: "manual",
      filename: `${chunk}.html`
    };
    config['plugins'].push(new HtmlWebpackPlugin(Object.assign(htmlConfig, cfg.html)));
  });
  config['entry'] = entries;
}


module.exports = merge(base, config);
