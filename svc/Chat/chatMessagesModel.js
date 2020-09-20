let mongoose = require("mongoose");
let {nanoid} = require("nanoid");
const { mongo } = require("../config");

let chatMessagesSchema = mongoose.Schema({
    messageID: {
        type: String,
        unique: true,
        default: nanoid,
    },
    userID: {
        type: String,
        require: true,
    },
    chatID: {
        type: String,
        require: true,
    },
    Text: String,
    Time: {type: Number, default: Date.now},
})

module.exports = mongoose.model("chat_message", chatMessagesSchema);