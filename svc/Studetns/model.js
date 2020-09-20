let mongoose = require("mongoose");
let deepPopulate = require("mongoose-deep-populate")(mongoose);
let crypto = require("crypto");
let {nanoid} = require("nanoid");

let StudentSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    userID: {
        type: String,
        unique: true,
        default: nanoid
    },
    loggedIn: {
        type: Boolean,
        default: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    passwordHash: String,
    chats: [{type: mongoose.SchemaTypes.ObjectId, ref: "chat"}],
    learningTargets : Array,
});


StudentSchema.virtual("password")
    .set(function (password) {
        this._plainPassword = password;
        debugger;
        if (password) {
            this.passwordHash = crypto.createHash("sha256").update(password).digest("hex");
        }else {
            this.salt = undefined;
            this.password = undefined; 
        }
    })
    .get(function () {
        return this._plainPassword;
    })

StudentSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.passwordHash) return false;

    return crypto.createHash("sha256").update(password).digest("hex") == this.passwordHash;
}

StudentSchema.index({lastName: "text", firstName: "text", location: "text"});
StudentSchema.index({learningTargets: 1});

StudentSchema.plugin(deepPopulate);

const StudentModel = mongoose.model("student", StudentSchema);
StudentModel.createIndexes();

module.exports = StudentModel;