/**
 * @description 默认webpack4配置
 */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//提取package里的包
function getVendors() {
  let pkg = require(path.resolve('.', './package.json'));
  let _vendors = [];
  for (const key in pkg.dependencies) {
    _vendors.push(key);
  }
  return _vendors;
}

const config = {
  output: {
    path: path.resolve('.', 'dist'),
    filename: '[name].[hash:8].bundle.js'
  },
  optimization: {
    //提取公共模块，webpack4去除了CommonsChunkPlugin，使用SplitChunksPlugin作为替代
    //主要用于多页面
    //例子代码 https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk
    //SplitChunksPlugin配置，其中缓存组概念目前不是很清楚
    splitChunks: {
      // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
      chunks: "all",
      // 表示在压缩前的最小模块大小，默认为0；
      minSize: 30000,
      //表示被引用次数，默认为1
      minChunks: 1,
      //最大的按需(异步)加载次数，默认为1；
      maxAsyncRequests: 3,
      //最大的初始化加载次数，默认为1；
      maxInitialRequests: 3,
      // 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；设置ture则使用默认值
      name: true,
      //缓存组，目前在项目中设置cacheGroup可以抽取公共模块，不设置则不会抽取
      cacheGroups: {
        //缓存组信息，名称可以自己定义
        commons: {
          //拆分出来块的名字,默认是缓存组名称+"~" + [name].js
          name: "test",
          // 同上
          chunks: "all",
          // 同上
          minChunks: 3,
          // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
          enforce: true,
          //test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
          test: ""
        },
        //设置多个缓存规则
        vendor: {
          test: /node_modules/,
          chunks: "all",
          name: "vendor",
          //表示缓存的优先级
          priority: 10,
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve('src'),
      use: [{
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-env'), require.resolve('babel-preset-react'), require.resolve('babel-preset-stage-2')],
          plugins: [
            [require.resolve('babel-plugin-transform-runtime'), {
              'helpers': false,
              'polyfill': true,
              'regenerator': true
            }]
          ]
        }
      }]
    }, {
      test: /\.txt$/,
      use: [{
        loader: require.resolve('raw-loader')
      }]
    }, {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: require.resolve('css-loader'),
        options: {
          url: true,
          root: path.resolve('.')
        }
      }, {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            require('postcss-flexbugs-fixes'),
            require('autoprefixer')({
              flexbox: 'no-2009',
              browsers: 'last 5 version'
            }),
            require('cssnano')()
          ]
        }
      }]
    }, {
      test: /\.less$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          url: true,
          root: path.resolve('.')
        }
      }, {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            require('postcss-flexbugs-fixes'),
            require('autoprefixer')({
              flexbox: 'no-2009',
              browsers: 'last 5 version'
            }),
            require('cssnano')()
          ]
        }
      },
      {
        loader: require.resolve('less-loader')
      }
      ]
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
      use: [{
        loader: require.resolve('url-loader'),
        options: {
          limit: 8192,
          name: '[name].[hash:8].[ext]',
          outputPath: 'images'
        }
      }, {
        loader: require.resolve('image-webpack-loader')
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
      use: [{
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'fonts'
        }
      }]
    }]
  },
  resolve: {
    extensions: [
      ".jsx", ".js", ".less", ".css", ".json"
    ],
    alias: {
      components: path.resolve('.', "src/components/"),
      modules: path.resolve('.', "src/modules/"),
      routes: path.resolve('.', "src/routes/"),
      layout: path.resolve('.', "src/layout/"),
      utils: path.resolve('.', "src/utils/")
    }
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'build:uba hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    }),
    new webpack.ProgressPlugin(),
    new webpack.optimize.RuntimeChunkPlugin({
      name: 'manifest'
    }),
    // new webpack.optimize.SplitChunksPlugin({
    //   cacheGroups: {
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //     //打包重复出现的代码
    //     vendor: {
    //       chunks: 'initial',
    //       minChunks: 2,
    //       maxInitialRequests: 5, // The default limit is too small to showcase the effect
    //       minSize: 0, // This is example is too small to create commons chunks
    //       name: 'vendor'
    //     },
    //     //打包第三方类库
    //     commons: {
    //       name: 'vendor',
    //       chunks: 'initial',
    //       minChunks: Infinity
    //     }
    //   }
    // })
  ]
};

module.exports = config;
