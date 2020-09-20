import { connect } from 'react-redux';

import Login from './Login';
import {loginUser} from '../../redux/actions';
const mapStateToProps = state => {
  return {
    user: state.user.data,
    userError: state.user.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loginUser: ({email, password}) => {
      dispatch(loginUser(email, password));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
