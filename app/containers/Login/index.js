import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import tool from '../../utils/tool';
import './index.scss';
import { login } from 'actions/login';

class Login extends Component {
  constructor(props) {
    super(props);
    document.title = '登录';
    this.state = {
    }
    
    this.login = this.login.bind(this)
  }

  componentWillMount() {
    document.onkeydown = (event) => {
      if (event.keyCode === 13) {
        this.login();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  login() {
    const refs = this.refs;
    const account = refs.account.value.trim();
    const password = refs.password.value.trim();

    const query = {
      password,
      account,
    }
    const promise = this.props.login(query);
    promise.then(() => {
      this.setState({
        errorText: null
      });
      this.context.router.push('/');
    }, error => {
      if (error) {
        this.setState({
          errorText: error.error && error.error.error_str
        });
      }
    });
  }
  
  render() {
    return (
      <div className="login-wrap center">
        <div className="login-form center">
  
          <div>
            用户名<input ref="account" className="account"/>
          </div>
          <div>
            密码<input ref="password" className="password" type="password"/>
          </div>
          <div>
            <button className="login" onClick={this.login}>登录</button>
          </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes={
  router:React.PropTypes.object
}

function mapStateToProps(state) {
  
  return {
    
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    login,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
