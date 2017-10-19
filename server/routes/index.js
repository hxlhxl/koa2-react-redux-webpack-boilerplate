'use strict'
const router = require('koa-router')();
const _ = require('lodash');
const env = process.env.NODE_ENV;
module.exports = function (app) {
	/*
	  路由分发规则： 依照代码顺序由上到下截获， 先处理特殊路由，再处理通用路由
	*/
	//react接管路由(get)
	// Render is attached to the koa context. Call `this.render` in your middleware to attach rendered html to 
	// the koa response body.
	// ref https://github.com/koajs/koa-hbs/tree/next
	router.post('/login',async(ctx,next) => {
		ctx.body = {
			"error": {
				"error_id": 0,
				"error_str": '',
			},
			"data": {
				"users": [{
						"name": "huaxiong",
						"age": 24,
						"sex": "male"
					},
					{
						"name": "zhaojaijin",
						"age": 24,
						"sex": "male"
					}
				]
			}
		};
	});
	router.get('/*', async (ctx) => {
			console.log('starting...',ctx.path)
			await ctx.render(getHtmlName(), {});
		}
	);
	app.use(router.routes());
};
//排除掉加载失败的静态资源
function isStatic(path) {
	var staticFile = ['.js', '.css', '/img/', '/lib', '/css', '/iconfont', '__webpack_hmr',
'favicon', '.json'];
	var isStatic = false;
	_.each(staticFile, function (val, key) {
		isStatic = path.indexOf(val) !== -1 ? true : isStatic;
	});
	return isStatic;
}
function getHtmlName(name = 'index'){
	return env !== 'development' ? name : name+'-dev';
}
