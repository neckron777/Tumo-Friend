import React, { Component } from 'react';

import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import './network.css';
import Socket from '../../socket';


import Chat from "../../components/Chat/ChatContainer";

import Drawing from './Drawing';

import VideoChat from './VideoChat';

class NetworkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessages:[],
      editorText: '',
    };

    this.handleNewChatMessage = this.handleNewChatMessage.bind(this);
  }
  handleNewChatMessage(message) {
    this.emitChatMessage(message);
  }

  emitChatMessage(message) {
    Socket.users.emit('chat-message', this.props.withUser, this.props.currentUser, message);
  }

  componentDidMount() {
    Socket.connect(users => {
      users.on('chat-message', (fromUser, message) => {
        addResponseMessage(message);
        this.setState((prevState) => ({
          chatMessages: [...prevState.chatMessages, message]
        }));
      });
    });
  }
  componentWillUnmount() {
    Socket.users.removeListener('chat-message');
  }
  render() {
    if (this.props.currentUser == null) return (null);

    return (
      <Container fluid={true} className="p-0">
        <Row noGutters={true}>
          <Col>
            <Tabs defaultActiveKey="canvas">
              <Tab eventKey="canvas"  title="Canvas">
                <Drawing withUser={this.props.withUser} currentUser={this.props.currentUser} />
              </Tab>
              <Tab eventKey="chat" title="Chats">
                <Chat />
              </Tab>
            </Tabs>          
          </Col>
          <Col>
            <div>
              {this.props.withUser ?
                <VideoChat
                  currentUser={this.props.currentUser}
                  caller={this.props.receiver ? this.props.withUser : this.props.currentUser}
                  receiver={this.props.receiver ? this.props.currentUser : this.props.withUser}
                /> : null
              }
            </div>
          </Col>
        </Row>

      </Container>
    )
  }
}

export default NetworkPage;
