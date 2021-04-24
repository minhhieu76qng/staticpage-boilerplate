const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')

const pagesPath = path.resolve(__dirname, 'src', 'pages')
const pages = fs.readdirSync(pagesPath)

function getEntries () {
  return pages.reduce((acc, page) => {
    acc[page] = path.join(pagesPath, page, 'index.js')
    return acc
  }, {})
}

const getHtmlPlugins = () => pages.map((page) => new HtmlWebpackPlugin({
  template: path.join(pagesPath, page, 'index.html'),
  inject: 'body',
  chunks: [page],
  filename: `${page}.html`
}))

module.exports = {

  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'eval-cheap-module-source-map',

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: getEntries(),

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080,
    writeToDisk: false // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
          // Please note we are not running postcss here
        ]
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: '[path][name].[ext]?hash=[hash:20]',
              esModule: false,
              limit: 8192
            }
          }
        ]
      }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    ...getHtmlPlugins(),
  ],
  resolve: {
    alias: {
      js: path.resolve(__dirname, 'src/js/'),
      styles: path.resolve(__dirname, 'src/styles/'),
      pages: path.resolve(__dirname, 'src/page/')
    }
  }
}
