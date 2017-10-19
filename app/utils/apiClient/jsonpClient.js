var count = 0;

function noop() {}
/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts) {
  if ('function' == typeof opts) {
    // fn = opts;
    opts = {};
  }
  if (!opts) opts = {};

  var prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  var id = opts.name || (prefix + (count++));

  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;

  var promise;
  //   设置全局jsonp函数，data是服务器返回的 函数参数【数据】
  // 设置promise
  promise = new Promise(function (resolve, reject) {
    if (timeout) {
      //   如果设置了超时，达到超时时间后取消jsonp，并给回调fn一个err参数
      timer = setTimeout(function () {
        cleanup();
        reject(new Error('Timeout'));
      }, timeout);
    }

    window[id] = function (data) {
      // debug('jsonp got', data);
      cleanup(); // 销毁script DOM
      resolve(data);
    };

    // add qs component
    url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
    url = url.replace('?&', '?');

    //   debug('jsonp req "%s"', url);

    // create script
    script = document.createElement('script');
    script.src = url;
    target.parentNode.insertBefore(script, target);

    function cancel() {
      if (window[id]) {
        cleanup();
        reject(new Error('Canceled'))
      }
    }
  })
  function cleanup() {
    //   父DOM移除子script DOM
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer); // 销毁定时器
  }
  promise.cancel = function() {
    if (window[id]) {
      cleanup();
    }
  };
  return promise;

}

export default jsonp;