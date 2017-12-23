const path = require("path");

module.exports = (env) => {
  return {
    config: {
      plugins: {
        mock: {

        },
        proxy: {

        },
        static: {

        }
      },
      css: {
        min : env.production,
        name: "[name].[hash:8].css"
      },
      html: {
        xhtml: true,
        inject: "body",
        hash: env.production,
        filename: 'index.html',
        template: "./view/index.html"
      },
      js: {
        min : env.production,
        name: "verdor",
        filename: "[name].[hash:8].js"
      },
      img: {
        name: "[name].[ext]"
      }
    },
    pack: {
      devtool: env.production ? "cheap-module-source-map" : "cheap-module-eval-source-map",
      entry: {
        app: ["./entry", env.HMR]
      },
      output: {
        path: path.resolve(__dirname, "public"),
        filename: '[name].[hash:8].bundle.js',
        publicPath: "/"
      },
      resolve: {
        extensions: [
          ".json"
        ],
        alias: {
          pages: path.resolve(__dirname, "src/pages/")
        }
      }
    }
  }
}
