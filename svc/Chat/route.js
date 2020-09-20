let router = require("express").Router();
let passport = require("passport");
let Chats = require("./chatModel");
let ChatsMessages = require("./chatMessagesModel");


router.post("/messages", passport.authenticate("jwt", {session: false}), 
    function(req, res) {
        debugger;
        if (!Array.isArray(req.body.keys) || req.body.query.length == 0) return res.status(400).send({});
        let result;

        ChatsMessages.find({chatID: {$in: req.body.keys}}, 
                {_id: 0},
                (res, err) => {
                    if (err) return console.log(err);

                    console.log(res);
                })

    });