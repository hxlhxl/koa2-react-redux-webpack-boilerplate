import superagent from 'superagent';
import jsonp from './jsonpClient';

const methods = ['get', 'post', 'put', 'patch', 'del', 'jsonp'];
function formatUrl(pathObj) {
    let {apiSource,path=false} = pathObj;
    if (!path) {
        path = path || pathObj;
    }
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    let hostname;
    if (apiSource) {
        hostname = $t.getApi()[apiSource];
    } else if (adjustedPath.indexOf('/go/api') !== -1) {
        hostname = $t.getApi().go;
    } else if (adjustedPath.indexOf('/python/api') !== -1) {
        hostname = $t.getApi().python;
    } else if ('') {
    }
    return hostname + adjustedPath;
}

function formatHostTypeUrl(path,hostType) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    const hostname = $t.getApi()[hostType];
    return hostname + adjustedPath;
}

export default class ApiClient {
    constructor(req) {
        // 由于不同的api位置不同，不得不做这种workaround
        methods.forEach((method) => {
            if (method === 'jsonp') {
                this[method] = (url,opts) => {
                    return jsonp(url,opts);
                }
            } else {
                this[method] = hostType => (path, actionHeader = {}, {params, data} = {}) => {
                    let request;
                    if (hostType) {
                        request = superagent[method](formatHostTypeUrl(path,hostType));
                    } else {
                        request = superagent[method](formatUrl(path));
                    }

                    const clientPromise = new Promise((resolve, reject) => {
                        request.type('form').set(actionHeader);
                        if (params) {
                            request.query(params);
                        }
                        if (req && req.get('cookie')) {
                            request.set('cookie', req.get('cookie'));
                        }
                        if (data) {
                            request.send(data);
                        }
                        request.end((err, response) => {
                            const result = {};

                            if (err) {
                                result.status = err.status || 500;
                                result.message = err.message;
                                reject(result)
                            } else if (response) {
                                result.status = response.status;
                                result.body = response.body || response.text;
                                resolve(result)
                            }
                        });

                    });

                    clientPromise.abort = () => {
                        request.abort()
                    };

                    return clientPromise;
                }
            }
        });
    }
    empty() {
    }
}
