import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route,} from "react-router-dom";
import { connect } from 'react-redux';
import {loginWithToken, logoutUser, startChat} from './redux/actions';

import Home from './pages/home/Home';
import Login from './pages/login/LoginContainer';
import Signup from './pages/signup/SignupContainer';
import Profile from './pages/profile/ProfileContainer';
import Search from './pages/search/SearchContainer';
import Network from './pages/network/NetworkContainer';

import Socket from './socket';
import Test from "./pages/test/Test";

import './App.css';

import NavigationBar from './components/NavigationBar/NavigationBarContainer';

class App extends Component {
  componentDidMount() {
    Socket.connect(users => {      
      users.on("start-chat", chat => {
        console.log("Start Chat From User", chat.fromUser);
        // this.props.startChat(chat);
      });
    });
    Socket.reconnect(users => {
      if (this.props.user.data) users.emit("join-to-room", {user: this.props.user.data.email, room: this.props.user.data.userID});
    })
    
    const token = sessionStorage.getItem("token");
    if(token) this.props.loginUserWithToken(token);
  }

  render() {
    return (
      <Router>
        <NavigationBar {...this.props}  />
        <Route path="/" exact >
          <Home user={this.props.user.data} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/search" component={Search} />
        <Route path="/network" component={Network} />
        <Route path="/profile" component={Profile} />
        <Route path="/test" component={Test} />
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
    loginUserWithToken: (token) => {
      dispatch(loginWithToken(token));
    },
    logoutUser: (user) => {
      dispatch(logoutUser(user));
    },
    startChat: (chat) => {
      dispatch(startChat(chat));
    }
});

export default process.env.NODE_ENV === "development" ? 
  hot(connect(mapStateToProps, mapDispatchToProps)(App)) : 
  connect(mapStateToProps, mapDispatchToProps)(App);
