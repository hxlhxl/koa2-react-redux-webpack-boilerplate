import React,{Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import './index.scss';


class Welcome extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="welcome">
                Welcome to koa2-react-redux-webpack-boilerplate!
            </div>
        )
    }
}
Welcome.contextTypes={
    router:React.PropTypes.object
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Welcome);