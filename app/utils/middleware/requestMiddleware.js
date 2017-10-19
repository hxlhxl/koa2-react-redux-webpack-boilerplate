
import {
  Message
} from '../../components/Widgets/';
class MiddleDefer {
  constructor() {
    this.defer = {};
    this.promise = new Promise((resolve, reject) => {
      Object.assign(this.defer, {
        resolve,
        reject
      });
    })
  }

  finaly(cb) {
    this.promise.then(() => {
      cb && cb();
    }, () => {
      cb && cb();
    })
  }
}
export default (client) => {
  return ({
    dispatch,
    getState
  }) => {
    return next => action => {
      const {
        method,
        scheme,
        api,
        types,
        showToast = true,
        showLoading = false
      } = action; // eslint-disable-line no-redeclare
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      if (scheme) {
        return next(action);
      }
      if (!api) {
        // 不是api这种请求uid为空 ''
        return next(Object.assign(action,{}));
      }

      
      if (method !== 'jsonp') {
        const [REQUEST, SUCCESS, FAILURE] = types;
        const state = getState();
        const login = state.get('login');

        let questType;
        // 放给下一个middleware -> history -> reducer
        // 发REQUEST类型的action不会更新state
        next(Object.assign(action, {
          type: REQUEST,
          result: {
            loading: true,
            success: false
          }
        }));
        if (showLoading) {
          Message.loading('正在加载...', 0)
        }
        const actionQuery = {};
        const timeStamp = Date.now();

        const actionPromise = api((path, type, query, origin) => {
        let token = login && login.get('token') || '';

          questType = type;

          const actionHeader = {
            'Accept': 'application/json',
            'token': token,
            'version': '0.0.1',
          };
          let aqData, action;
          aqData = {
            qid: timeStamp
          }
          aqData = Object.assign(aqData, {
            type
          });

          actionQuery.data = aqData;
          query = query || {};
   
          Object.assign(actionQuery.data, {
            query: JSON.stringify(query)
          });
          if (origin) {
            actionQuery.origin = origin;
          }
          return client.post()(path, actionHeader, actionQuery)
        });


        const resolveFn = (result, resolve) => {

          Object.assign(result, {
            success: true,
            loading: false
          })
          next(Object.assign({},action, {
            result,
            type: SUCCESS
          }));
          resolve(result)
        };

        const rejectFn = (result, reject) => {
          Object.assign(result, {
            success: false,
            loading: false,
            msg: (result.error && result.error_str) ? result.error_str : '网络错误'
          })
          next(Object.assign({}, action, {
            result,
            type: FAILURE
          }));
          reject(result);
        };

        const getError = result => {
          return result.body && result.body.error;
        }

        const middeleDefer = new MiddleDefer();

        actionPromise.then(
          result => {
            Message.destroy();
            const error = getError(result);
            if (error) {
              if (error.error_id == 0) {
                resolveFn(result.body, middeleDefer.defer.resolve);
              } else {
                rejectFn(result.body, middeleDefer.defer.reject);
              }
            } else {
              showToast ? Message.error('请求错误,没返回结果', 2) : ''
              rejectFn(result, middeleDefer.defer.reject)
            }
          },
          (error) => {
            if (/^4[0-9]{2}$/.test(error.status) // 4开头错误·
            ) {
              showToast ? Message.error('请检查网络连接', 2) : '';
            }
            if (/^5[0-9]{2}$/.test(error.status)) // 5开头错误
            {
              showToast ? Message.error('服务器发生错误，请稍后再试', 2) : '';
            }
            rejectFn(error, middeleDefer.defer.reject)
          }
        )
        middeleDefer.promise.abort = () => {
          actionPromise.abort();
          next(Object.assign({}, action, {
            result: {
              success: false,
              loading: false,
              msg: 'cancel'
            },
            type: FAILURE
          }));
        }
        return middeleDefer.promise;
      } else {
        next(action);
      }

    };
  };
}