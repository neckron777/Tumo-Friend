import { connect } from 'react-redux'

import Signup from './Signup';
import { createUser } from '../../redux/actions';

const mapStateToProps = state => {
  return {
    user: state.user.data,
    userError: state.user.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createUser: ({email, password, firstName, lastName, learningTargets, location}) => {
      dispatch(createUser(email, password, firstName, lastName, learningTargets, location));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);


