/* util
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2018-04-23 15:30:56
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-04-24 10:27:41
 */

const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const fse = require('fs-extra');
const argv = require("minimist")(process.argv.slice(2));
const commands = argv;

/**
 * 获得当前运行路径
 * @param {*} file 获得文件路径
 */
exports.getRunPath = (file) => {
  return path.resolve(".", file);
}
/**
 * 获得uba.config
 */
exports.getUbaConfig = () => {
  try {
    return require(this.getRunPath("config.js"));
  } catch (error) {
    this.errorLog(error, 'The "uba.config.js" configuration file was not found', true);
    process.exit(0);
  }
}

/**
 * 获得.ubarc 插件配置
 */
exports.getUbaRc = () => {
  try {
    return fse.readJSONSync(this.getRunPath('.ubarc'));
  } catch (error) {
    this.errorLog(error, 'The ".ubarc" configuration file was not found', true);
    process.exit(0);
  }
}

/**
 * 获取package.json
 */
exports.getPkg = () => {
  return require("../package.json");
}
/**
 * 加载插件
 */
exports.loadPlugins = app => {
  let plugins = this.getUbaRc();
  for (let i = 0; i < Object.keys(plugins).length; i++) {
    let key = Object.keys(plugins)[i];
    let opt = Object.values(plugins)[i];
    try {
      let plg = require(this.getRunPath(`node_modules/uba-server-${key}`));
      plg(app, opt);
      console.log(chalk.yellow(`[plugin] The ${key} plugin is loaded.`))
    } catch (error) {
      this.errorLog(error, 'Please check if the plugin is correct', true);
      process.exit(0);
    }
  }
}
/**
 * 获得项目下所有dependencies
 */
exports.getVendors = () => {
  let pkg = require(this.getRunPath("package.json"));
  let _vendors = [];
  for (const key in pkg.dependencies) {
    _vendors.push(key);
  }
  if (!_vendors.length) {
    return null;
  }
  return _vendors;
}

/**
 * 显示插件信息
 */
exports.showPluginInfo = () => {
  let plugins = this.getUbaRc();
  for (let key in plugins) {
    console.log(chalk.green(` [plugin]    : Load ${key} plugin`));
  }
}

/**
 * 错误处理
 * @param {*} err 错误对象
 * @param {*} msg 描述文字
 * @param {*} statck 是否显示错误栈
 */
exports.errorLog = (err, msg, statck) => {
  console.log(chalk.bold.red(`>> Error Message:`));
  console.log(chalk.cyan(err.message));
  msg && console.log(chalk.yellow(`[message] ${msg}`));
  console.log(chalk.bold.red(`>> End`));
  statck && console.log()
  statck && console.log(chalk.bold.red(`>> Stack Message:`));
  statck && console.log(chalk.cyan(err.stack));
  statck && console.log(chalk.bold.red(`>> End`));
}
