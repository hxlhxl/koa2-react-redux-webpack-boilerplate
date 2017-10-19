import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import './index.scss';

// actionCreator
import {OP_AUTH, saveAuth, requestOA003, requestOA002, requestOA004 } from 'actions/login';
// utils
import pureRender from 'utils/pureRender';
import PropTypes from 'prop-types';

@pureRender.immutableRenderDecorator
class Root extends Component {
  constructor(props) {
    super(props);

    document.title = 'koa2-react-redux-webpack-boilerplate';
    const user = $t.getStorage('auth');
    this.state = {
    }
    this.logout = this.logout.bind(this);
    this.logoutNoApi = this.logoutNoApi.bind(this);

  }
  componentWillMount() {
    const { saveAuth, requestOA004 } = this.props;
    let auth = localStorage.getItem('auth');
    auth = auth && JSON.parse(auth);
    if (!auth) {
      this.context.router.replace('/login');
      return;
    } else {
      saveAuth(auth);
      auth = localStorage.getItem('auth');
      auth = auth && JSON.parse(auth);
    }
  }


  logout() {
    const { user, requestOA003 } = this.props;
    const uid = user && user.get('uid');
    requestOA003({
      uid
    }).then((res) => {
      this.logoutNoApi();
    }, (error) => {})
  }

  logoutNoApi() {
    localStorage.removeItem('auth');
    this.context.router.replace('/login');
  }

  render() {
    const { curTitleIndex, curMenuTitle, menuData, editPasswordModal, pwdError } = this.state;
    const { user, requestOA002 } = this.props;
    if(_.isEmpty(user && user.toJS())) {
      return null;
    }
    let { routes, params = {} } = this.props;
    return (
      <div className="root">
        <div className="root-header"></div>
        <div className="root-content">
          <div className="left-content"></div>
          <div className="right-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Root.contextTypes={
  router:React.PropTypes.object
}
Root.propTypes = {
  // requestOA004: PropTypes.func.isRequired
}
function mapStateToProps(state) {
  const user = state.get('login'); 
  return {
    user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

    OP_AUTH,
    saveAuth,
    requestOA004,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
