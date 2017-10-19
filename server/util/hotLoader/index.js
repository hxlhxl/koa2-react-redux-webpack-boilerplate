// http://shaojing.wang/2016/11/17/hot-middleware-for-koa/

module.exports = (app) => {
  const path = require('path');
  const webpack = require('webpack');
  const webpackConfig = require('../../../webpack/dev');
  const convert = require('koa-convert');
  const compiler = webpack(webpackConfig);
  // 热重载 koa 2
  // const devMiddleware = require('koa-webpack-middleware').devMiddleware;
  // const hotMiddleware = require('koa-webpack-middleware').hotMiddleware;

  // app.use(devMiddleware(compiler,{
  //   noInfo: true,
  //   watchOptions: {
  //       aggregateTimeout: 300,
  //       poll: true
  //   },
  //   publicPath: webpackConfig.output.publicPath, // 这个属性是required，和webpack的publicPath等值
  //   stats: {
  //       colors: true
  //   }
  // }));
  // app.use(hotMiddleware(compiler,{
  //   log: console.log,
  //   path: '/__webpack_hmr',
  //   heartbeat: 10 * 1000
  // }));
  
  // koa 1.x
  // webpack-dev-middleware: t's a simple wrapper middleware for webpack. 
  // It serves the files emitted from webpack over a connect server. This should be used for development only.
  
  /*
    'use strict';

    const expressMiddleware = require('webpack-dev-middleware');

    function middleware(doIt, req, res) {
      const { end: originalEnd } = res;

      return (done) => {
        res.end = function end() {
          originalEnd.apply(this, arguments);
          done(null, 0);
        };
        doIt(req, res, () => {
          done(null, 1);
        })
      };
    }

    module.exports = (compiler, option) => {
      const doIt = expressMiddleware(compiler, option);

      function* koaMiddleware(next) {
        const ctx = this;
        const { req } = ctx;
        const locals = ctx.locals || ctx.state;

        ctx.webpack = doIt;

        const runNext = yield middleware(doIt, req, {
          end(content) {
            ctx.body = content;
          },
          locals,
          setHeader() {
            ctx.set.apply(ctx, arguments);
          },
        });

        if (runNext) {
          yield *next;
        }
      }

      Object.keys(doIt).forEach(p => {
        koaMiddleware[p] = doIt[p];
      });

      return koaMiddleware;
    };
  */
  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    },
  });
  // webpack-hot-middleware -> Webpack hot reloading using only webpack-dev-middleware. 
  // This allows you to add hot reloading into an existing server without webpack-dev-server.

  /*
    var webpackHotMiddleware = require('webpack-hot-middleware');

    function middleware(doIt, req, res) {
        var originalEnd = res.end;
        return function(done) {
            res.end = function() {
                originalEnd.apply(this, arguments);
                done(null, 0);
            };
            doIt(req, res, function() {
                done(null, 1);
            });
        };
    }

    module.exports = function(compiler, option) {
        var action = webpackHotMiddleware(compiler, option);
        return function* (next) {
            var nextStep = yield middleware(action, this.req,  this.res);
            if (nextStep && next) {
                yield* next;
            }
        };
    };



  */

  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler,{
    noInfo: true
  });

  app.use(convert(devMiddleware))
  app.use(convert(hotMiddleware));


  // app.hotPath = path.resolve(compiler.outputPath, '../views/index.html');
  //放于路由中
  // app.use(function *() {
  //   console.log(compiler.outputPath);
  //   this.body = this.webpack.fileSystem.readFileSync(path.resolve(compiler.outputPath, '../views/index-dev.html')).toString();
  // });
}
