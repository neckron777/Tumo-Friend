import React from "react";


import {ArrowRightSquareFill,} from "react-bootstrap-icons";
import {LinkContainer} from "react-router-bootstrap"
import {Button} from "react-bootstrap";

import "./Chat.css";

class Chat extends React.Component {
    constructor (props) {
        super(props) 
                
        this.currentUser = {
            email: 'test2@gmail.com',
            userID: "U12167",
            firstName: 'Test2User',
            lastName: 'Testyan',                       
            loggedIn: true
        };

        this.messages = {
            "C1":  [
                ["1", {time: "11:10", messageID: 1, userID: "U12167", message: "Hi",}],
                ["2", {time: "11:12", messageID: 2, userID: "U12167", message: "How are you ?"}],
                ["3", {time: "11:15", messageID: 3, userID: "U12895", message: "Hello" }],
                ["4", {time: "11:15", messageID: 4, userID: "U12895", message: "Fine :)"}],
                ["5", {time: "11:30", messageID: 5, userID: "U12167", message: "Ինչ կա բրատ"}],
            ],
            "C2": []
        }

        this.chats = {
            "C1": {
                chatID: "C1",
                members: [
                    {
                        email: "el.zakarjan@gmail.com",
                        userID: "U12895",
                        firstName: "Elen",
                        lastName: "Zakaryan",
                        loggedIn: false,
                    },
                ],     
            },
            "C2": {
                chatID: "C2",
                members: [
                    {
                        email: "vardan.zakarjan@gmail.com",
                        userID: "U12899",
                        firstName: "Vardan",
                        lastName: "Zakaryan",
                        loggedIn: false,
                    },
                ],
            },
        }

        this.state = {
            ActiveID: "",
            activeChatName: "",
            sendFormValues: {},
        };

        this.messageInputRef = React.createRef();

        this.Resize = this.Resize.bind(this);
        this.SelectChat = this.SelectChat.bind(this);
        this.SendMessage = this.SendMessage.bind(this);
        this.handleNewMessages = this.handleNewMessages.bind(this);
    }
    
    RenderMessagesContainer() {
        let Messages = [];
        debugger;
        let currentChatMessages = this.props.messages[this.state.ActiveID];

        if (currentChatMessages === undefined) return null;


        for (let messageIndex = 0; messageIndex < currentChatMessages.length; ++messageIndex) {
            let messageKey = currentChatMessages[messageIndex][0]
            let messageObject = currentChatMessages[messageIndex][1];

            let checkUser = (this.currentUser.userID == messageObject.userID) ? 1 : 0;

            Messages.push((
                <div key={currentMessageUserID + "_" + Math.round(Date.now() * Math.random())} 
                     className={(!checkUser) ? "ChatMessageBox my" : "ChatMessageBox other"}>
                    
                    <div key={message.messageID} className="ChatMessage">
                        <span>{message.message}</span>
                        <div className="ChatMessageTime">{message
                        .time}</div>
                    </div>                                
                </div>
            ))
        }

        return Messages;
    }

    RenderroupsList () {
        let Groups = []; 

        for (let chatKey in this.props.chats) {
            let Chat = this.props.chats[chatKey];
            // let GroupName = (type == "personal") ? `${Chat.withUser.firstName} ${Chat.withUser.lastName}` : null;
            let GroupName =  `${Chat.withUser.firstName} ${Chat.withUser.lastName}`;

            Groups.push((
                <div key={Chat.chatID} id={Chat.chatID} onClick={this.SelectChat}
                     className={(this.state.ActiveID == Chat.chatID) ? "ChatGroup active" : "ChatGroup"} >
                    <div className="ChatAvatar">
                        <div className="ChatAvatarCHAR">{Chat.withUser.firstName[0].toUpperCase() + Chat.withUser.lastName[0].toUpperCase()}</div>
                        {Chat.withUser.loggedIn ? 
                            <div className="ChatUserStatus online"></div> 
                            :
                            <div className="ChatUserStatus offline"></div>    
                        }
                        
                    </div>
                    <div className="ChatGroupNameBox">
                        <div className="ChatGroupName">{GroupName}</div>
                        <div className="ChatGroupLastMessage"></div>  
                    </div>    
                </div>
            ));
        }

        return Groups;
    }

    Resize(evnet) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
        console.log("ScrollHeight: ", event.target.scrollHeight, " Height: ", event.target.style.height);
    }

    handleNewMessages(event) {
        let newField = {}
        newField[this.state.ActiveID] =  event.target.value;

        let newSF = Object.assign(this.state.sendFormValues, newField);

        this.setState({sendFormValues: newSF});
    }

    SelectChat(event) {
        let newID = event.currentTarget.id;
        let newValue = {};
        newValue[newID] = (this.state.sendFormValues[newID]) ? this.state.sendFormValues[newID] : "" ;

        this.setState(
            {
                ActiveID: newID, 
                activeChatName: this.props.chats[newID].withUser.firstName + " " + this.props.chats[newID].withUser.lastName,
                sendFormValues: Object.assign(this.state.sendFormValues, newValue),
            });
    }


    SendMessage(event) {
        let messageObject = {};
        debugger;

        if (this.state.sendFormValues[this.state.ActiveID].length == 0) return;

        messageObject.text = this.state.sendFormValues[this.state.ActiveID];
        messageObject.chatID = this.state.ActiveID;
        messageObject.SenderUID = this.props.currentUser.userID;
        messageObject.ReceiverUID = this.props.chats[this.state.ActiveID].withUser.userID;

        console.log(messageObject);

        this.props.AddNewMessage(messageObject);
    }

    render () {
        if (this.props.currentUser == null) {
            return (
                <div className="ChatPleassSignIn">
                    <LinkContainer to={{pathname:"/login"}}>
                        <Button variant="outline-primary" size="lg">Sign in</Button>
                    </LinkContainer>
                </div>
            )
        }

        return (
            <div id="ChatComponent" className="Chat">
                    {/* <ChatGroupsList ClickHendler={this.ChangeActiveChat} ActiveID={this.state.ActiveID} GroupsList={this.chats} CurrentUser={this.currentUser} /> */}
                    <div className="ChatGroupsList"> 
                         {this.RenderroupsList()}
                    </div>
                    <div className="ChatField">
                        <div className="ChatHeader">
                            <div className="ChatName">{this.state.activeChatName}</div>
                            {/* {true ? 
                                <div className="ChatUserStatus online"></div>
                                :
                                <div className="ChatUserStatus offline"></div>
                            } */}
                        </div>
                        <div className="ChatMessageContainer">
                            {this.RenderMessagesContainer()}
                        </div>
                        {this.state.ActiveID ? 
                            <form action="" className="ChatSendMessageForm" onSubmit={() => {return false;}}>
                                <textarea ref={this.messageInputRef} 
                                    value={this.state.sendFormValues[this.state.ActiveID]}
                                    onInput={this.Resize}
                                    onChange={this.handleNewMessages}
                                    className="MessageInput" placeholder="Message ..."></textarea>
                                <button type="button" onClick={this.SendMessage} className="ChatSendMessageButton">
                                    <ArrowRightSquareFill className="ChatSendMessageIcon"  color={"rgb(15, 79, 119)"} size={30} />
                                </button>
                            </form>
                        : null}
                    </div>   
            </div>
        );
    }
}


export default Chat;