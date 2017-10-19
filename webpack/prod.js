const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const base = require('./base');
require("babel-polyfill");

const extractCSS = new ExtractTextPlugin('css/[name].[contenthash]-one.css');
const extractSASS = new ExtractTextPlugin({
    filename: 'css/[name].[contenthash]-two.css',
    disable: false,
    allChunks: true
});
module.exports = merge(base, {
  // devtool: false,
  entry: {
    vendor: ['babel-polyfill']
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: extractSASS.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
           beautify: false,
           // 删除所有的注释
           comments: false,
           sourceMap: 'cheap-module-source-map',
           compress: {
             // 在UglifyJs删除没有用到的代码时不输出警告
             warnings: false,
             // 删除所有的 `console` 语句
             // 还可以兼容ie浏览器
             drop_console: true,
             // 内嵌定义了但是只用到一次的变量
             collapse_vars: true,
             // 提取出出现多次但是没有定义成变量去引用的静态值
             reduce_vars: true,
           }
    }),
    // 输出css
    extractCSS,
    extractSASS
  ]
});
