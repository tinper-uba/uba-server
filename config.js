/**
 * Tinper-Uba 工程配置文件
 */

const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {
  let config = {
    //入口位置和类型
    //entry: "src/pages/*/index.js",
    //应用类型：single=单页面、multipage=多页面
    //appType=single，entry正常配置与webpack4一致
    //appType=multi，entry按照blob的方式设置扫描参数
    //https://www.npmjs.com/package/glob
    appType: "multi",
    // entry: "./src/app.jsx",
    entry: "./src/pages/*/index.js",
    //HTML模板设置
    //appType=multi 后 html节点失效，默认去查找entry一致的index.html
    html: {
      //template: "./src/index.html",
      hash: false,
      xhtml: true
    },
    resolve: {
      //模块别名
      //import Foo from 'components/Foo' 等价 import Foo from './src/components/Foo.jsx'
      alias: {
        components: path.resolve(__dirname, "src/components/"),
        modules: path.resolve(__dirname, "src/modules/"),
        routes: path.resolve(__dirname, "src/routes/"),
        layout: path.resolve(__dirname, "src/layout/"),
        utils: path.resolve(__dirname, "src/utils/")
      },
      //默认加载ES模块扩展名
      extensions: [
        ".tsx"
      ],
    },
    //外部全局对象导入内部对象，用于内部import { Button } from 'tinper-bee'
    //key:value 形式，其中key是代表内部from模块名，value代表外部全局对象window.TinperBee
    externals: {
      // "axios": "axios",
      // "react": "React",
      // "react-dom": "ReactDOM",
      // "tinper-bee": "TinperBee"
    },
    //加载器用于webpack处理未知文件格式
    loader: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }],
    //加载插件
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
  return config;
}
