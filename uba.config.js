var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

module.exports = function() {
  var time = new Date();
  return {
    entry : {
      main : ['./a.js',hotMiddlewareScript],
      vendor : ['./b.js',hotMiddlewareScript]
    },
    output: {
      filename: '[name].min.js',
      publicPath: "/dist"
    }
  }
}
