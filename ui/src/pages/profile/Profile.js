import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import { Container, Form, FormGroup ,} from 'react-bootstrap';

/**
 * React component for Profile page
 */
class Profile extends Component {
  // constructor(props) {
  //   // TODO: set state based on props, drop down values for learningTargets, locations, form event handlers
  //     super(props);
  //  }
  handleSubmit(e) {
    // TODO: EXTRA WORK - handle form submit (if doing updates)
  }
  handleChange(type, value) {
    // TODO: EXTRA WORK - handle form change to set state (if doing updates)
  }
  render() {
    // TODO: use to redirect to home page if user not logged in
    if (this.props.user == null) {
      return (
        <Redirect to={{
          pathname: '/login',
        }} />
      )
    }
    return (
      <Container className="mt-5">
        <h1>Profile</h1>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" value={this.props.user && this.props.user.firstName} disabled />
          </Form.Group>
          <Form.Group>  
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" value={this.props.user && this.props.user.lastName} disabled />
          </Form.Group>
          <Form.Group>  
            <Form.Label>E-Mail</Form.Label>
            <Form.Control type="email" value={this.props.user && this.props.user.email} disabled />
          </Form.Group>
          <Form.Group>  
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" value={ this.props.user && this.props.user.location} disabled />
          </Form.Group>
          <Form.Group>  
            <Form.Label>Learning Targets</Form.Label>
            <Form.Control type="email" disabled value= {this.props.user && this.props.user.learningTargets}/>
          </Form.Group>
      </Container>      
    )
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  userError: PropTypes.string,
}

export default Profile;
