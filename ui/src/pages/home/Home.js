import React from 'react';

import './home.css';

import {Button} from "react-bootstrap";

import tumoColorLogo from './tumo-color-logo.png';
import {Redirect} from "react-router";
import {LinkContainer} from "react-router-bootstrap";

export default ({user}) => {
 
  if (user) return (<Redirect to={{pathname: "/profile"}} />)

  return (
    <div className="full-background"> 
      <div className="caption">
        <img className="tumo-logo-caption" src={tumoColorLogo}  alt="tumo"/>
        <p className={"display-4 text-black font-weight-bold"}>
          <LinkContainer to={{pathname: "/login"}}><Button className size="lg" variant="primary">Sign In</Button></LinkContainer>
          <LinkContainer to={{pathname: "/signup"}}><Button size="lg" variant="success">Sign Up</Button></LinkContainer>
        </p>
      </div>
     </div>
)};
