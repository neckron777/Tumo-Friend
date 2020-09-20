import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { logoutUser } from '../../redux/actions'
import NavigationBar from './NavigationBar';

const mapStateToProps = state => ({
  currentUser: state.user.data,
  withUser: state.network.withUser,
  receiver: state.network.receiver

})

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: (user) => {
      dispatch(logoutUser(user))
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationBar));
