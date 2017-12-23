const path = require("path");
const chalk = require("chalk");
const portfinder = require("portfinder");

/**
 * 获得当前运行路径
 * @param {*} file 获得文件路径
 */
exports.getRunPath = (file) => {
  return path.resolve(".", file);
}

/**
 * 获得uba配置
 */
exports.getUbaConfig = () => {
  try {
    return require(this.getRunPath("uba.config.js"))("develop");
  } catch (error) {
    console.log(error);
    console.log(chalk.red("[uba] : 'uba.config.js' is error !"))
    process.exit(0);
  }
}

/**
 * 获得可用的端口
 */

// exports.getPort = () => {
//   portfinder.basePort = 3000;
//   return portfinder.getPortPromise();
// }

exports.getPort = async() => {
  portfinder.basePort = 3000;
  return new Promise((resolve, reject) => {
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err);
      } else {
        resolve(port);
      }
    });
  });
}

/**
 * 获取package.json
 */
exports.getPkg = () => {
  return require("../package.json");
}
