// TODO: use --> import Socket from '../socket';\
import Socket from '../socket'
import {CreateNewMessage, HandleUserData} from "../utils/index";

const apiHost = process.env.REACT_APP_API_HOST  || 'http://localhost:3001';
const axios = require('axios');

export const createUser = (email, password, firstName, lastName, learningTargets, location) => {
  return dispatch => {
    const user = {
      email,
      password,
      firstName,
      lastName,
      learningTargets,
      location
    };
    axios.post(`${apiHost}/students`, user)
    .then(response => {
      dispatch({
        type: 'CREATE_USER',
        payload: response.data.result,
      })
    })
    .catch(err => {
      dispatch({
        type: 'CREATE_USER_ERROR',
        payload: getErrorMessage(err)
      })
    })
  }
}

export const logoutUser = (user) => {
  return dispatch => {
    Socket.users.emit("logout", user);
    
    debugger;
    sessionStorage.removeItem("token");

    dispatch({
      type: "LOGOUT_USER",
      payload: null
    });
  }
  
}

const login = (user) => {
  return dispatch => {
    let result = HandleUserData(user);
    let chatKeys = Object.keys(result.chats);

    Socket.users.emit("login", {email: user.email, userID: user.userID});
    debugger;



    dispatch({type: 'LOGIN_USER', payload: result.user});
    dispatch({type: "INIT_CHAT", payload: result});
    dispatch(GetMessages(chatKeys));
  }
}

export const loginUser = (email, password) => {
  return dispatch => {
    axios.post(`${apiHost}/students/login`, {username: email, password: password})
    .then(response =>{      
      debugger;
      sessionStorage.setItem("token", response.data.token);

      login(response.data.result)(dispatch);
    })
    .catch(err => {
      dispatch({
        type: 'LOGIN_USER_ERROR',
        payload: getErrorMessage(err)
      })
    })
  } 
};

export const AddNewMessage = (message) => {
  return dispatch => {
    let  {text, SenderUID, ReceiverUID, chatID} = message
    Socket.users.emit("chat-message", CreateNewMessage(text, SenderUID, ReceiverUID, chatID), (result) => {
      console.log(result);
      dispatch({type: "ADD_NEW_MESSAGE", payload: result});
    })
  }
} 

const GetMessages = (keyList, limit = 25, pivot = 0) => {
  return dispatch => {
    axios.post(`${apiHost}/chats/messages`, {keys: keyList, limit: limit,})
      .then(res => {
        dispatch({type: "INIT_MESSAGES", payload: res});
      }); 
  }
}

export const loginWithToken = (token) => {
  return dispatch => {
      axios.post(`${apiHost}/students/login`, {}, {headers: {"auth_token": token}})
      .then(response => {
        login(response.data.result)(dispatch);
      })
      .catch(err => {

      })
  }
}  

export const updateUser = () => {
  return dispatch => {
    /**
     * TODO: Update User action
     * 1. Call Update User API
     * 2. Dispatch action
     */
  }
}


export const imReceiver = () => ({
  type: 'IM_THE_RECEIVE',
})


export const InitChats = (users) =>  {
  return dispatch => {

  }
}

export const startChat = (user, withUser) => {
  return dispatch => {
    debugger;
	  Socket.users.emit("start-chat", withUser, user);

    dispatch({type: "START_CHAT", withUser})
  }
}

export const stopChat = () => {
  return dispatch => {
    dispatch({type: "STOP_CHAT",})
  }
}

// Use helper function to parse error message from API
function getErrorMessage(err) {
  let message = null;
  if (err.response) {
    message = err.response.data.error || err.response.data;
  } else if (err.request) {
    message = "No response from backend service.";
  } else if (err.error) {
    message = err.error;
  } else {
    message = err.message;
  }
  console.log(err);
  return message;
}
