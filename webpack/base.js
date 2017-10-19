const path = require('path');
const env = process.env.NODE_ENV;

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 编译时将js文件复制到指定目录，在html文件中直接包含；复制到的路径是output中的path路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const sPath = env === 'development' ? 'debug' : 'public';
// 这个地方的话，oa项目暂时没有CDN，所以都放在本地
const publicPath = env === 'development' ? '/' : '/mioa/';  // https://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts
const smap = env === 'development' ? '?sourceMap' : '';
const htmlName = env === 'development' ? 'index-dev.html' : 'index.html';
const babelPresets = env === 'development' ?  ['es2017','es2016','es2015', 'react', 'react-hmre']: [['es2015', {'modules': false}], 'react'];
const clientPath = path.resolve(__dirname, '../app/');
const distPath = path.resolve(__dirname, `../server/${sPath}/`);
const configPath = path.resolve(__dirname, '../app/config');
const nodePath = path.resolve(__dirname, '../node_modules/');
const cwd = process.cwd();
// process.traceDeprecation = true;
console.log(`\x1b[33m ContentMode is ${env},${env} to path : \x1b[0m`, distPath);

const tool = path.resolve(clientPath, 'utils/tool');
const date = Date.now();


module.exports = {
  entry: {
    index: `${clientPath}/index.js`,
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'immutable', 'lodash']
  },
  output: {
    publicPath,
    path: distPath,
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /.js[x]?$/,
        exclude: [path.resolve(cwd, "node_modules")],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ["import", { "libraryName": "antd", "style": 'css', }],
                ["transform-class-properties", { "spec": true }],
              ],
              presets: babelPresets ,
              cacheDirectory: env === 'development' ? './webpack-cache/' : false
            }
          }
        ]
      },
      //urlloader这两个，只针对 require方式引用有效。其他未通过 require引用的，不会被转译路径和压缩神马的
      {
        test: /\.(gif|png|jpe?g)\??.*$/,
        use: {
            loader: 'url-loader',
            options: {
              // limit: 8192,
              name: 'img/[name].[hash:8].[ext]'
            }
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)\??.*$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: `css/iconfont/[hash:8].[ext]?t=${date}`
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackMd5Hash(),

    // 单独压缩输出
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // 将变量暴露到全局，使用时不需要写 const React = require('React'); 直接在页面中写 React即可识别
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      Immutable: 'immutable',
      $config: configPath,
      $t: tool
    }),
    new CopyWebpackPlugin([
      { from: `${clientPath}/sources/lib`, to: 'js' },
      { from: `${nodePath}/monaco-editor/min/vs`, to: 'vs' },
    ]),
    new HtmlWebpackPlugin({
      template: `${clientPath}/index.html`,
      inject: true,
      filename: `../views/${htmlName}`
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  resolve:{
    extensions: [
        '.js',
        '.jsx',
        '.css',
        '.scss'
    ],
    alias: {
      sources: path.resolve(clientPath, './sources'),
      actions: path.resolve(clientPath, './actions'),
      components: path.resolve(clientPath, './components'),
      containers: path.resolve(clientPath, './containers'),
      reducers: path.resolve(clientPath, './reducers'),
      utils: path.resolve(clientPath, './utils'),
      docs: path.resolve(cwd,'./docs/api/'),
      'font-awesome': path.resolve(cwd,'./node_modules/font-awesome/scss/font-awesome.scss'),
      'slick-carousel': path.resolve(cwd,'./node_modules/slick-carousel/slick/slick.scss'),
      'slick-carousel-theme': path.resolve(cwd,'./node_modules/slick-carousel/slick/slick-theme.scss'),
    }
  }
};
