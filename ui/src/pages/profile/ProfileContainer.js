import { connect } from 'react-redux'

import Profile from './Profile';

const mapStateToProps = state => {
  // TODO: pass logged in user data
    return {
      user: state.user.data
    } 
}

const mapDispatchToProps = dispatch => {
  // TODO: EXTRA WORK - pass update user action 
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
