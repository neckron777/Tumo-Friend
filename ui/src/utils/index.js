export const CreateNewMessage = (text, SUID, RUID, CID,) => { return {text: text, fromUser: SUID, toUser: RUID,  chatID: CID}};
export const HandleUserData = (data) => {    
    let user = data;
    let chats = (data.chats) ? data.chats : null;
    let messages = {};
    let membersList = [];

    delete user.chats;
    
    if (chats && chats.length > 0) {
        let c = {};

        for (let chat = 0; chat < chats.length; ++chat) {
          let id = chats[chat].chatID;
          c[id] = chats[chat];
          c[id].withUser = c[id].members.filter(member => member.userID !== user.userID)[0];
          delete c[id].members;
        }

        //// Test
        c["Test"] = {chatID: "Test", withUser: {email: "test3@gmail.com", firstName: "Test_3", lastName: "Testyan", userID: "1"}};

        chats = c;
    
        for (let key in chats) {
            messages[key] = [];
            membersList.push({user: chats[key].withUser.userID, chat: key});
        }
    }

    return {user: user, chats: chats, membersList: membersList, messages: messages,};
};