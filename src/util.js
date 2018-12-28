/* util
 * @Author: Kvkens(yueming@yonyou.com)
 * @Date:   2017-5-15 00:00:00
 * @Last Modified by:   Kvkens
 * @Last Modified time: 2018-12-28 16:52:24
 */

const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const argv = require("minimist")(process.argv.slice(2));
const commands = argv;

exports.getConfig = function () {
  let ubaConfig;
  try {
    ubaConfig = require(path.resolve(".", "uba.config.js"));

    !commands.noProcess && ubaConfig.devConfig.plugins.push(new webpack.ProgressPlugin());

    //ubaConfig.devConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  } catch (e) {
    console.log(chalk.red(e));
    console.log(chalk.yellow("Please check uba.config.js configuration file"));
    process.exit(0);
  }
  return ubaConfig;
}

/**
 * 获取package.json
 */
exports.getPkg = () => {
  return require("../package.json");
}