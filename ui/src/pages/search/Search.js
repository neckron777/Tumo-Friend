import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import Socket from '../../socket';
import {Container, Col, Row, Tab, ListGroup, Form, Button, Badge, InputGroup} from 'react-bootstrap';

/**
 * React component to render search page
 */
class Search extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
			list: [],
			textSearch: "",
		}

		Socket.connect(() => {});
		this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {	
	this.onStudentLoggedIn();
	this.onStudentLoggedOut();
	this.query();
}
  handleSubmit(event) {
   event.preventDefault();
   const searchText = ReactDOM.findDOMNode(this.refs.searchTextRef).value;
   this.query(searchText);
  }
  onStudentLoggedIn() {
    Socket.users.on('logged in', user => {
		console.log("onLoggedIn");	
		this.query(this.state.textSearch);
	});
  }
  onStudentLoggedOut() {
    Socket.users.on('logged out', user => {
		console.log("onLoggedOut");	
		this.query(this.state.textSearch);
	});
  }
  onstartChat(withUser) {
	this.props.startChat(this.props.currentUser, withUser);
	
	this.props.history.push("/network");
  }
  query(textSearch = "") {
		this.setState({textSearch});
		let currentUser = this.props.currentUser;

		console.log("Query: ", textSearch);

		Socket.users.emit('query', { search: textSearch}, (results) => {
			if (currentUser) {
			  results = results.filter(r => currentUser.email !== r.email)
			}
			this.setState({list: results});
		});	
}
  render() {
	if (this.props.currentUser == null) return (null);

    return (
      <Container className="mt-5">
		  <Form onSubmit={this.handleSubmit}>
			<Row className="justify-content-md-center mt-4 mb-4">
				<Col xs lg={6}>
					<Form.Group>
						<InputGroup>
							<Form.Control ref={"searchTextRef"} as="input" type="text"></Form.Control>
							<InputGroup.Prepend>
								<Button vairant="primary" type="submit">Search</Button>
							</InputGroup.Prepend>
						</InputGroup>
					</Form.Group>
				</Col>
				<Col md="auto">
				</Col>	
			</Row>
			<Row>
				<Tab.Container id="search-results" defaultActiveKey="#user0">
					<Col md={{span: 6, offset: 1}}>
						<ListGroup>
							{this.state.list.map((user, index) => (
								<ListGroup.Item
									key={`#user${index}`}
									eventKey={`#user${index}`}
									as="button"
									>
									<span>{user.firstName} {user.LastName}</span>
									{user.loggedIn ? <Badge className="ml-2" variant="success" >Logged In</Badge> : null}
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
					<Col md={4}>
						<Tab.Content style={{width: "300px"}}>
                			{this.state.list.map((user, index) => (
                				<Tab.Pane key={`#user${index}`} eventKey={`#user${index}`}>
                			    	<div>Name: {user.firstName} {user.lastName}</div>
                			    	<div>Email: {user.email} </div>
                			    	<div>Learning Targets: {user.learningTargets.join(', ')}</div>
                			    	<div>Location: {user.location}</div>
                			    	<Button className="mt-3" onClick={(e) => {e.preventDefault(); this.onstartChat(user)}}>Start Chat</Button>
                				</Tab.Pane>
                			))}
              			</Tab.Content>
					</Col>
				</Tab.Container>
			</Row>
		  </Form>
      </Container>
    )
  }
}

Search.propTypes = {
  startChat: PropTypes.func,
  currentUser: PropTypes.object,
};

export default Search;