require('colors')
const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractCSSWebpackPlugin = require('mini-css-extract-plugin')
const OptimizeCSSWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const OptimizeJSWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
const ErrorOverlayWebpackPlugin = require('error-overlay-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production' || process.argv.indexOf('-p') === -1

const HTMLInjecterConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/demo/index.html'),
  filename: 'index.html',
  inject: 'body'
})

const CSSExtracterConfig = new ExtractCSSWebpackPlugin({
  filename: dev ? '[name].css' : '[name].[hash].css',
  chunkFilename: dev ? '[id].css' : '[id].[hash].css'
})

const JSOptimizerConfig = new OptimizeJSWebpackPlugin({
  cache: true,
  parallel: true,
  sourceMap: true
})

const CSSOptimizerConfig = new OptimizeCSSWebpackPlugin({})

const ProgressBarConfig = new ProgressBarWebpackPlugin({
  format: `${':msg'.cyan} [:bar] ${':percent'.green} (${':elapsed'.green} seconds)`,
  clear: false
})

const EnvironmentConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
})

const devPlugins = [
  HTMLInjecterConfig,
  CSSExtracterConfig,
  new ErrorOverlayWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
]

const prodPlugins = [
  HTMLInjecterConfig,
  CSSExtracterConfig,
  EnvironmentConfig,
  new webpack.ProgressPlugin()
]

// If clean build is desired, add CleanWebpackPlugin
if (process.argv.indexOf('-c') !== -1) prodPlugins.push(new CleanWebpackPlugin())

// If in CI, don't output progress to stdout to reduce log clutter
if (!process.env.CI) prodPlugins.push(ProgressBarConfig)

// Helper for easier alias creation
// const createAlias = modulePath => path.resolve(__dirname, modulePath)

console.log(process.env.TEST)

// Webpack config
module.exports = {
  // Development server
  devServer: {
    host: 'localhost',
    port: 8000,
    hot: true,
    open: (!process.env.TEST && !process.env.CI) && true,
    headers: {
      'Access-Control-Allow-Origin': '*' // Allow CORS
    }
  },

  // Production optimisers
  optimization: {
    minimizer: dev ? [] : [JSOptimizerConfig, CSSOptimizerConfig]
  },

  // Entry point
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, '/demo/index.jsx')
  ],

  // Dummies for native Node modules not present in browser scope
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    crypto: 'empty'
  },

  // Loaders
  module: {
    rules: [
      { // JSX
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { // SCSS
        test: /\.scss$/,
        use: [
          dev ? 'style-loader' : ExtractCSSWebpackPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      { // Images
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },

  // Extension config
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom' // DOM patches for react-hot-loader
      // Internal shortcuts
    }
  },

  // Production build
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/build')
  },

  devtool: 'cheap-module-source-map',
  mode: dev ? 'development' : 'production',
  plugins: dev ? devPlugins : prodPlugins
}
