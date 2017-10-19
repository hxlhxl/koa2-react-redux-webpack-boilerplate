process.env.root = __dirname;
/*
const fs = require('fs');
const child_process = require('child_process');
const dataPath = process.env.root + '/api/login.js';
var workerProcess = child_process.spawn('json-server', [dataPath, '--port',3002]);
workerProcess.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});
workerProcess.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});
workerProcess.on('close', function (code) {
  console.log('子进程已退出，退出码 ' + code);
});
*/

const path = require('path');
const Koa = require('koa');
const config = require('./config');
const koaMiddle = require('./util/koa');
const app = new Koa();
// router 会依赖 上面的定义的一些变量，务必放在最后引用
const router = require('./routes');
// 绑定koa相关配置到app
koaMiddle(app);
router(app);
let port = config.env[process.env.NODE_ENV].port;

app.on('error', (err) => {
  console.log('error', err);
});

app.listen(port);
if (module.hot) {
  module.hot.accept()
}
console.log('koa server started at port 3000');