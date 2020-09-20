let socketIO = require('socket.io');
let Chat = require("./Chat/chatModel");
let Students = require("./Studetns/model");
let ChatMessages = require("./Chat/chatMessagesModel");

class Socket {
	constructor () {
		this.io = null, //socketIO(server);
		this.namespaces = {};
	}

	init(server) {
		if (this._checkIO()) return null
		this.io = this.namespaces["root"] = socketIO(server);
	}

	_checkIO() {
		if (this.io || this.io instanceof socketIO) return true;
		return false; 
	}

	createNameSpace(npName) {
		if (!this._checkIO()) return null

		npName = npName.toLowerCase();
		this.namespaces[npName] = this.io.of(npName);
	}

	nameSpace(npName) {
		if (!this._checkIO()) return null
		
		npName = npName.toLowerCase();
		return this.namespaces[npName];
	}

	on(type, npName = null , cb) {
		if (!this._checkIO()) return null
		if (npName == null) npName = "root";

		this.namespaces[npName].on(type, cb); 
	}

	connect(npName, cb) {
		if (!this._checkIO()) return null
		
		this.namespaces[npName].on('connection', (socket) => cb(socket, this.namespaces[npName]));
	} 

	default() {
		this.connect("users", (socket, users) => {
			console.log("Socket.Conneted: ", socket.id);

			socket.on("login", async user => {
				socket.join(user.userID)
				users.emit("logged in", user);

				console.log("Socket.Login: ", user.userID, `(${user.email})`);
			});

			socket.on("test", () => {
				debugger;
				console.log(users.adapter.rooms);
			})

			socket.on("logout", user => {
				socket.leave(user.userID);
				users.emit("logged out", user);


				console.log("Socket(logout): ", user.userID, `(${user.email})`);

				Students.findOneAndUpdate(
					{userID: user.userID},
					{$set: {'loggedIn': false}},
					{returnOriginal: false},
					(err, results) => {
						if (err) return console.log(err);
					});
			})
			
			socket.on('disconnect', () => {});

			// socket.on("create-chat", async (toUser, fromUser) => {});
			// socket.on("join-chat", async (chatID, userID) => {});
			// socket.on("leave-chat", async (chatID, userID) => {});

			socket.on("join-to-room", (query) => {
				console.log("Socket.Join: ", "user: ", query.user, ", room: ", query.room);
				socket.join(query.room);
			});

			socket.on("start-chat", async (toUser, fromUser) => {
				debugger;
				if (toUser && fromUser) {

					let newChat = new Chat({
						members: [toUser._id, fromUser._id],
					}); 

					console.log(newChat.toJSON());
					await newChat.save()
						.then((res) => {
							Students.updateMany(
								{userID: { $in: [toUser.userID, fromUser.userID] } },
								{$push: { chats: res._id } },
								{returnOriginal: false},
								(err, res) => {
									if (err) return console.log(err);
		
									users.in(toUser.userID).emit('start-chat', {chatID: newChat.chatID, fromUser: fromUser});
									console.log("Chat Started: ", toUser.email, " -> ", fromUser.email, `(${newChat.chatID})`,);
								}) 

							
						})
						.catch((err) => console.log(err));
				}
			});
	  
			socket.on("chat-message", async (messageObject, fn) => {
				debugger;
				console.log(messageObject);

				let message = ChatMessages({
					text: messageObject.text,
					userID: messageObject.fromUser,
					chatID: messageObject.chatID,
				});

				await message.save()
					.then(results => {
						delete results._id;
						fn(results.toObject())
						console.log("Chat Message: ", results.text, " ", results.chatID);
					})
					.catch(err => console.log(err));


			});
			
			socket.on("drawing-message", (toUser, fromUser, message) => {
				 if (toUser) users.in(toUser.email).emit("chat-message", fromUser, message);
			});

			socket.on("query", (params, fn) => {
				let criteria = {};
				if (params.search) {
					const textCriteria = {$text: {$search: params.search}};
					const learningTargetCriteria = {learningTargets: params.search};
			  
					criteria = {$or: [textCriteria, learningTargetCriteria]};	  
			  	}
		  
				// console.log("Query.params: ", params.search, `(${socket.id})`);
				// console.log("Query.criteria: ", criteria);


			  	Students.find(criteria, {passwordHash: 0}).sort({loggedIn: -1}).exec((err, results) => {
					if (err) {
						console.log("Query.err", err);
						socket.emit('list error', err);
					} else {
					 	fn(results);
					}
				});  
			});
	  	});
	}
}

const instance = new Socket();

module.exports = instance;
