import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import {Container, Alert} from 'react-bootstrap';


/**
 * Component for Login Page
 */
export default class Login extends Component {
    constructor(props) {
      super(props);

      this.state = {email: "",password: "" };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleChange(e){
    this.setState({[e.target.type]: e.target.value });

  }
  handleSubmit(event){
    event.preventDefault();
    this.props.loginUser(this.state);

  }
  render() {
    // TODO: use to redirect if user not logged in
    if (this.props.user) {
      return (
        <Redirect to={{
          pathname: '/profile',
        }} />
      )
    }
    return (
    	<Container className="mt-3">
      		<h1 className="display-4 text-secondary">Login</h1>  <br></br> <br></br>
      		<Form onSubmit={this.handleSubmit}>
  				<Form.Group controlId="formBasicEmail">
    				<Form.Label>Email address</Form.Label>
    				<Form.Control onChange = {this.handleChange} type="email" placeholder="Enter email" />
    				<Form.Text className="text-muted">
     					 We'll never share your email with anyone else.
    				</Form.Text>
  				</Form.Group>

  				<Form.Group controlId="formBasicPassword">
  				  <Form.Label>Password</Form.Label>
  				  <Form.Control onChange = {this.handleChange}type="password" placeholder="Password" />
  				</Form.Group>
  				<Form.Group controlId="formBasicChecbox"></Form.Group>
  				<Button type="submit">
  				  Submit
  				</Button>
			</Form>
        	<p className="h5">Don't have an account? <a href="/signup">Sign-up to connect!</a></p>
      	</Container>
    	)
	}
}
Login.propTypes = {
  loginUser: PropTypes.func,
  user: PropTypes.object,
  userError: PropTypes.string,
}