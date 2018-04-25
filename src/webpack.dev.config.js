/**
 * @description develop
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

const config = {
  devtool: "cheap-module-eval-source-map",
  mode: 'development',
  entry: {
    app: ['./src/app.jsx', require.resolve('./hot-middleware/client')]
  },
  externals: {
    "axios": "axios",
    "react": "React",
    "react-dom": "ReactDOM",
    "tinper-bee": "TinperBee"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
module.exports = merge.smart(base, config);
