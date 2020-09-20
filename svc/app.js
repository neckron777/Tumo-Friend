let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let helmet = require("helmet");
let config = require("./config");

let chatRouter = require("./Chat/route");
let studentsRouter = require('./Studetns/route');

let passport = require('passport');

let JWTStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt
let LocalStrategy = require('passport-local').Strategy;

let cors = require('cors')

let db = require("./db");
let Students = require("./Studetns/model");

let app = express();

app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(helmet());
app.set('x-powered-by', false);

app.use(cookieParser());
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/students', studentsRouter);
app.user("/chats", chatRouter);

db.connectAsync()

/**
 * ********************
 * TUMO CHANGES BELOW *
 * ********************
 */

passport.use(new LocalStrategy(
  function(username, password, done) {
      Students.findOne({email: username}, (err, user) => {
        if (err) return done(err);
        if (!user || !user.checkPassword(password)) return done(null, false);

        return done(null, user);
      })
  }))


const JWTOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("auth_token"),
  secretOrKey: config.jwt.secret,
}

passport.use(new JWTStrategy(JWTOptions, 
  function (payload, done) {
      if (!payload) return done(null, false);

      return done(null, {email: payload.email, jwt: true});
  }));

module.exports = app;
