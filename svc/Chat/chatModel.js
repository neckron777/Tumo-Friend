let mongoose = require("mongoose");
let {nanoid} = require("nanoid");
const { mongo } = require("../config");

let ChatScheam = mongoose.Schema({
    chatID: {
        type: String,
        unique: true,
        default: nanoid
    },
    type: String,
    members: [{type: mongoose.SchemaTypes.ObjectId,  ref: "student"}],
})



module.exports = mongoose.model("chat", ChatScheam);