const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const base = require('./base');
// const webpack-hot-middleware
//不要传空对象，和空数组（传空是replace，不是merge）
module.exports = merge(base, {
  devtool: 'eval-source-map',
  entry: {
    vendor: ['webpack-hot-middleware/client']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),  // WARNING in webpack: Using NoErrorsPlugin is deprecated.Use NoEmitOnErrorsPlugin instead.
    new webpack.NoEmitOnErrorsPlugin(),

  ],
});
