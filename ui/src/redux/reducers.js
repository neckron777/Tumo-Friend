import { combineReducers } from 'redux';

// TODO: update user reducer for logi, profile update, and logout
const user = (state = {data: null, error: null}, action) => {
  switch (action.type) {
 
    case 'CREATE_USER':
      return { data: action.payload, error: null};
    case 'CREATE_USER_ERROR':
      return { data: null, error: action.payload};
    case 'LOGIN_USER':
      return { data: action.payload, error: null};
    case 'LOGIN_USER_ERROR':
      return { data: null, error: action.payload};
    case 'LOGOUT_USER':
      return {data: null,error: null };
    default:
      return state
  }
}

const NetworInitState = {
  withUser: null, 
  receiver: false
}

// TODO: reducer for networking with peer - start/stop chat
const network = (state = NetworInitState, action) => {
  switch(action.type) {
    case "START_CALLING": 
    case "STOPC_CALLING":
    case "IM_THE_RECEIVE":
      return {...state, receiver: true}
    case "LOGAUT_USER": 
      return {withUser: null, receiver: false}
    default:
      return state;
  }
}

const ChatInitalState = {
  activeChat: null,
  list: {}, 
  chatMembers: [],
  messages: {},
}

const chat = (state = ChatInitalState, action) => {
  switch(action.type) {
    case "INIT_CHAT": 
      return {
        ...state,
        list: action.payload.chats,
        chatMembers: action.payload.membersList,
        messages: action.payload.messages,
      }

    case "ADD_NEW_MESSAGE": 
      let message = [action.payload.userID, action.payload];
      return {...state, messages: Object.assign(state.messages, state.messages[action.payload.chatID].push(message))}
    // case "START_CHAT":
      
    // case "STOP_CHAT":
    // case "NEW_MESSAGE":
    // case "MEMBER_LOGGED_IN": 
    // case "MEMBER_LOGGED_OUT":
    default:
      return state;
  }
} 

export default combineReducers({
 user,
 network,
 chat,
});
