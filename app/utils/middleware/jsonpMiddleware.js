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
                types,
                api,
                showToast,
                showLoading,
            } = action;
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }
            if (method !== 'jsonp') {
                return next(action);
            }
            if (!api) {
                return next(action);
            }

            const [REQUEST, SUCCESS, FAILURE] = types;
            const reqObj = Object.assign(action, {
                type: REQUEST,
                result: {
                    loading: true,
                    success: false,
                }
            });
            next(reqObj);
            if (showLoading) {
                Message.loading('正在加载...', 0);
            }

            if (method) { // jsonp方法
                const actionPromise = api((url, opts) => {
                    return client[method](url, opts); // promise
                });
                const resolveFn = (result, resolve) => {
                    Object.assign(result, {
                        success: true,
                        loading: false,
                    });
                    const myaction = Object.assign({}, action, {
                        result,
                        type: SUCCESS,
                    });
                    next(myaction);
                    resolve(result);
                };
                const rejectFn = (error, reject) => {
                    Object.assign(error, {
                        success: false,
                        loading: false,
                        msg: 'JSONP网络错误',
                    });
                    next(Object.assign({}, action, {
                        result,
                        type: FAILURE,
                    }));
                    reject(result);
                };
                const middleDefer = new MiddleDefer();

                actionPromise.then(
                    result => {
                        resolveFn(result, middleDefer.defer.resolve);
                    },
                    error => {
                        console.log('jsonp请求失败');
                        showToast ? Message.error('请求错误，没返回结果', 2) : '';
                        rejectFn(error, middleDefer.defer.reject);
                    }
                );
                middleDefer.promise.cancel = () => {
                    actionPromise.cancel();
                    // 把失败取消的请求传递下去,reducer会发现FAILURE这种请求
                    next(Object.assign({}, action, {
                        result: {
                            success: false,
                            loading: false,
                            msg: 'cancel',
                        },
                        type: FAILURE,
                    }));
                }
                return middleDefer.promise;
            };
        };
    };
}