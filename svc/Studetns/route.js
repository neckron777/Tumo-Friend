let router = require('express').Router();
let passport = require('passport');
let jwt = require("jsonwebtoken");
let config = require("../config");

let Students = require("./model");


/* Create a student account */ /* ուղել !!!!  */
router.post('/', function(req, res, next) {
  Students.findOne({email: req.body.email}, async function (err, user) {
    if (err) return res.status(500).send({status: 10, action: "createUser", message: "Server Error", result: null});
    if (user) return res.status(400).send({status: 1, action: "createUser", message: `Student ${student.emile} already exists!`, result: null});
    debugger;
    const student = new Students({
      email: req.body.email,
      password: req.body.password,
      location: req.body.location,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      learningTargets: req.body.learningTargets,
    })
  
    console.log(student.password);
    await student.save()
      .then(result => {
        console.log(result);
        res.status(200).send({status: 0, action: "createUser", message: "Ok", result: result})
      })
      .catch(err => {
        console.log(err);
        res.status(500).send({status: 20, action: "createUser", message: "Server Error", result: null });
      });
  })
});

/* Get a single student: req.user.username */
router.get('/:email', passport.authenticate('jwt', { session: false }),
  function(req, res) {
    Students.findOneAndUpdate(
        {email: req.params.email},
        {$set: {loggedIn: true}},
        {
          projection: {
            _id: 0, 
            passwordHash: 0
          },
          returnOriginal: false, 
        }, (err, result) => {
            debugger;
            if (err) return res.status(500).send({error: "Server Error"});
            if (!result) return res.status(400).send({error: "Student does not exists"})
        
            res.send(result);
    })
});

/* Update a student account */
router.put('/:email', passport.authenticate('jwt', { session: false }),
  function(req, res, next) {
    // TODO: EXTRA CREDIT update student record

    // db.getClient().collection("students").findOne({email: req.params.email}, function(err, result ) {
    //     if (err) {
    //       console.log(err)
    //       res.status(400).send(err.massage);
    //     }
    //     console.log(result);
    //     // dg.getClient.collection("students").updateOne()
    // });
});

router.post("/login", passport.authenticate(['local', 'jwt'], {session: false}),
  function(req, res) {
    Students.findOneAndUpdate(
      {email: req.user.email},
      {$set: {'loggedIn': true}},
      {
        projection: {
          passwordHash: 0,
        },
        returnOriginal: false},
      )
      .populate({
        path: "chats",
        select: "members chatID -_id",

        populate: {
          path: "members",
          select: "firstName lastName email userID -_id",
        }
      })
      .exec((err, u) => {
        let resObject = {status: 0, action: "login", message: null, result: null}
        let user = u.toObject();

        if (err) {
          resObject.status = 10;
          resObject.message = "Server Error"
          console.log(err);
          return res.status(500).send(resObject);
        }
        if (!user){
          resObject.status = 1,
          resObject.message = "User Not Found"
          
          return res.status(400).send(resObject);
        }
        
        if(!req.user.jwt)  {
          let payload = {
            email: user.email,
            userID: user.userID,
          }
          resObject.token = jwt.sign(payload, config.jwt.secret);
        }

        resObject.message = "Ok";
        resObject.result = user;
             
        res.status(200).send(resObject);
      });
});

module.exports = router ;
