const _ = require('lodash');
const propery = {
  
};


const tool = {
  // sessionStorage
  setSessionStorage: function(name,data) {
    if (!window.sessionStorage.getItem(name)) {
      window.sessionStorage.setItem(name,JSON.stringify(data));
    }
  },
  getSessionStorage: function(name) {
    return window.sessionStorage.getItem(name) && JSON.parse(window.sessionStorage.getItem(name));
  },
  getStorage: function (name) {
    return localStorage.getItem(name) && JSON.parse(localStorage.getItem(name));
  },
  setStorage: function (name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  },
  removeStorage: function (name) {
    localStorage.removeItem(name);
  },
  getHostName: function () {
    return window.location.hostname;
  },
  getApi: function() {
    let hostname = this.getHostName();
    window.apiConfig = {};
    //dev环境下，特殊域名配置写在这个下面。例如打宋怡超开发机等
    if(process.env.NODE_ENV === 'development'){
      apiConfig.fake = 'http://localhost:3000';      
      apiConfig.php = 'http://localhost:9000';
      apiConfig.python = 'http://localhost:3004';
    } else if (process.env.NODE_ENV === 'production') {
      apiConfig.fake = 'http://localhost:3000';
      apiConfig.php = 'http://localhost:9000';
      apiConfig.python = 'http://localhost:3004';
    }
    return apiConfig;
  },
  emailRegExp(value) {
    value = value || '';
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(value)
  },
  phoneRegExp(value) {
    value = value || '';
    const regexp = /^[0-9]{11}$/;
    return regexp.test(value);
    },
  logout() {
    this.removeStorage('auth');
    window.location.href = `/#/login`;
  },
};

_.each(propery, (val ,key) => {
  tool[`get${key}`] = function() {
    return _.cloneDeep(val);
  }
});

const momentUtil = require('./momentUtil').default; // 兼容babel,refs: https://stackoverflow.com/questions/33704714/cant-require-default-export-value-in-babel-6-x
const windowUtil = require('./windowUtil').default;
const utils = {
  'momentUtil': momentUtil,
  'windowUtil': windowUtil
};
for (let util in utils) {
  tool[util] = utils[util]
}
module.exports = tool;
