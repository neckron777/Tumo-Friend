import {connect} from "react-redux";

import Chat from "./Chat";

import {AddNewMessage} from "../../redux/actions"

const mapStateToProps = state => {
    return {
        chats: state.chat.list,
        messages: state.chat.messages,
        chatMembers: state.chat.chatMembers,
        currentUser: state.user.data,
    }
}

const mapDispatchToProps = dispatch => (
    {
        AddNewMessage: (messageObject) => {
            dispatch(AddNewMessage(messageObject))
        }
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Chat);