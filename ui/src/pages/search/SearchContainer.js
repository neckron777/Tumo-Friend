import { connect } from 'react-redux'

import Search from './Search';

import {startChat} from "../../redux/actions";

const mapStateToProps = state => ({
	currentUser: state.user.data,
  userError: state.user.error,
  chats: state.chat.list
})

const mapDispatchToProps = dispatch => ({
    startChat: (user, withUser) => {
      dispatch(startChat(user, withUser));
    } 
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);