/**
 * Created by miaojilvxing on 16/4/28.
 * 获取环境变量，加载不同配置文件，并将配置对象暴露出去
 */

// 通过NODE_ENV来设置环境变量，如果没有指定则默认为开发环境
if(process.env.NODE_ENV !== 'development') {
 process.env.NODE_ENV = 'production';
}
 module.exports = {
   //用于判断开发还是发布环境（test，pre等全部为发布环境）
   env: {
     development: {
       port: 3000,
       sPath: '/debug'
     },
     production: {
       port: 3001,
       sPath: '/public'
     },
   }
 };
