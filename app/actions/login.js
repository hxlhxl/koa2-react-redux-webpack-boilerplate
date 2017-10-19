export const REQUEST_OA001 = Symbol.for('登录');
export const REQUEST_OA001_SUCCESS = Symbol.for('登录成功');
export const REQUEST_OA001_FAIL = Symbol.for('登录失败');
// 登录方法
export function login(query) {
	// action creator below
	return (dispatch, getState) => {
		// real pure object action.thunk -> next(action) -> requestMiddleware
		let promise = dispatch({
			types: [REQUEST_OA001, REQUEST_OA001_SUCCESS, REQUEST_OA001_FAIL],
			api: action => action({apiSource: 'fake', path: '/login'}, 'auth', query),
			showToast: false
		});
		promise.then((result) => {
			const auth = result.data;
			storageAuth(auth);
		});
		return promise;
	}
}




export const REQUEST_OA002 = Symbol.for('修改密码');
export const REQUEST_OA002_SUCCESS = Symbol.for('修改密码成功');
export const REQUEST_OA002_FAIL = Symbol.for('修改密码失败');

export const REQUEST_OA003 = Symbol.for('退出账户');
export const REQUEST_OA003_SUCCESS = Symbol.for('退出账户成功');
export const REQUEST_OA003_FAIL = Symbol.for('退出账户失败');

export const REQUEST_OA004 = Symbol.for('获取用户最新信息');
export const REQUEST_OA004_SUCCESS = Symbol.for('获取用户最新信息成功');
export const REQUEST_OA004_FAIL = Symbol.for('获取用户最新信息失败');

export const REQUEST_OA005 = Symbol.for('通过邮箱获取验证码请求');
export const REQUEST_OA005_SUCCESS = Symbol.for('通过邮箱获取验证码请求成功');
export const REQUEST_OA005_FAIL = Symbol.for('通过邮箱获取验证码请求失败');

export const REQUEST_OA006 = Symbol.for('重置密码');
export const REQUEST_OA006_SUCCESS = Symbol.for('重置密码成功');
export const REQUEST_OA006_FAIL = Symbol.for('重置密码失败');


export const SAVE_AUTH = Symbol.for('保存用户登录信息');

// 登录方法
export function requestOA001(query) {
	// action creator below
	return (dispatch, getState) => {
		// real pure object action.thunk -> next(action) -> requestMiddleware
		let promise = dispatch({
			types: [REQUEST_OA001, REQUEST_OA001_SUCCESS, REQUEST_OA001_FAIL],
			api: action => action('/oa/api/v1/user', 'auth', query),
			showToast: false
		});
		promise.then((result) => {
			const auth = result.data;
			storageAuth(auth);
		});
		return promise;
	}
}

// 修改密码方法
export function requestOA002(query) {
	return (dispatch, getState) => {
		let promise = dispatch({
			types: [REQUEST_OA002, REQUEST_OA002_SUCCESS, REQUEST_OA002_FAIL],
			api: action => action('/oa/api/v1/user', 'modify', query),
			showToast: false
		});
		return promise;
	}
}

// 退出账号方法
export function requestOA003(query) {
	return (dispatch, getState) => {
		let promise = dispatch({
			types: [REQUEST_OA003, REQUEST_OA003_SUCCESS, REQUEST_OA003_FAIL],
			api: action => action('/oa/api/v1/user', 'logout', query),
			showToast: false
		});
		return promise;
	}
}

// 获取用户最新信息方法
export function requestOA004(query) {
	return (dispatch, getState) => {
		let promise = dispatch({
			types: [REQUEST_OA004, REQUEST_OA004_SUCCESS, REQUEST_OA004_FAIL],
			api: action => action('/oa/api/v1/user', 'update', query),
			showToast: false
		});
		promise.then((result) => {
			const auth = result.data;
			storageAuth(auth);
		});
		return promise;
	}
}

export function requestOA005(query) {
	return (dispatch, getState) => {
		let promise = dispatch({
			types: [REQUEST_OA005, REQUEST_OA005_SUCCESS, REQUEST_OA005_FAIL],
			api: action => action('/oa/api/v1/user', 'vcode', query),
			showToast: false
		});
		// promise.then((result) => {
		// 	const auth = result.data;
		// 	storageAuth(auth);
		// });
		return promise;
	}
}

export function requestOA006(query) {
	return (dispatch, getState) => {
		let promise = dispatch({
			types: [REQUEST_OA006, REQUEST_OA006_SUCCESS, REQUEST_OA006_FAIL],
			api: action => action('/oa/api/v1/user', 'reset', query),
			showToast: false
		});
		// promise.then((result) => {
		// 	const auth = result.data;
		// 	storageAuth(auth);
		// });
		return promise;
	}
}

// 保存登录信息到storage
export function storageAuth(auth) {
	localStorage.setItem('auth', JSON.stringify(auth));
}

// 保存用户登录信息
export function saveAuth(auth) {
	return {
		type: SAVE_AUTH,
		auth
	}
}