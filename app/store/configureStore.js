import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import requestMiddleware from '../utils/middleware/requestMiddleware';
import jsonpMiddleware from '../utils/middleware/jsonpMiddleware';
import nullMiddleware from '../utils/middleware/nullMiddleware';

import ApiClient from '../utils/apiClient/ApiClient';
import reducer from '../reducers/root';

const middlewares = [
    thunk, 
    jsonpMiddleware(new ApiClient()),
    requestMiddleware(new ApiClient()),
    nullMiddleware(),
    routerMiddleware(hashHistory)
]

export default initialState => {
    return createStore(reducer, initialState, compose(
        applyMiddleware(...middlewares),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__({
            actionsFilter: (action) => {
                action.type = String(action.type)
                return action;
            }
        }): f => f
    ));
}