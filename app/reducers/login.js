import * as types from 'actions/login';
import Immutable from 'immutable';

export default (state = Immutable.fromJS({}), action) => {
	switch (action.type) {
		case types.REQUEST_OA001_SUCCESS:
		case types.REQUEST_OA004_SUCCESS:
      const data = action.result && action.result.data;
			return state.merge(Immutable.fromJS(data));
    case types.SAVE_AUTH:
      return state.merge(Immutable.fromJS(action.auth));
		default: {
			return state;
		}
	}
}