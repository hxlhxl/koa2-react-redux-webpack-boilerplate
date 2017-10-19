/**
 *  jiaoyuxin
 */
const favicon = require('koa-favicon');
const hbs = require('koa-hbs');
const static = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');
const logger = require('koa-logger');
const gzip = require('koa-gzip');
const koaBody = require('koa-body');
const cors = require('kcors');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const cacheControl = require('koa-cache-control');
const root = process.env.root;
const config = require(`${root}/config`);
const convert = require('koa-convert');

module.exports = (app) => {
  const {sPath} = config.env[process.env.NODE_ENV];
  const root = process.env.root;
  if (process.env.NODE_ENV === 'development') {
    app.use(responseTime());
    app.use(logger());
    // 暂时不使用
    const hotLoader = require('../hotLoader');
    hotLoader(app);
  }else {
    // etag works together with conditional-get
    // app.use(cacheControl({
    //   maxAge: 60*60*24*7*1000
    // }));
    // app.use(conditional());
    // app.use(etag());
  }
  // 各种中间件
  app.use(cors({origin: '*'}));
  app.use(koaBody({
    "formLimit":"5mb",
    "jsonLimit":"16mb",
    "textLimit":"5mb"
  }));
  app.use(convert(gzip()));
  app.use(static(root + sPath));
  //如果是／ ，不要mount
  // app.use(mount('/', app));
  // app.use(mount('/mioji/dmp', app));
  app.use(favicon(`${root}${sPath}/favicon.ico`));
  app.use(bodyParser());
  app.use(hbs.middleware({
    viewPath: `${root}/views`,
    extname: '.html',
  }));
};
