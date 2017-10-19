import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Immutable from 'immutable';
import configureStore from './store/configureStore';
import route from './config/route';
import './components/Style/index.scss';
// 引入CSS库
import 'sources/iconfont/iconfont.css';
import 'font-awesome';
import 'slick-carousel';
import 'slick-carousel-theme';
const store=configureStore(Immutable.Map());

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Provider store={store}>
                <Router routes={route} history={hashHistory}>
                </Router>
            </Provider >
        )
    }
}
render(<App />, document.getElementById('app'));
