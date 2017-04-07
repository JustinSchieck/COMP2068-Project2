/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-04-05T12:51:14-04:00
 */



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport dependencies
let passport = require('passport');

let session = require('express-session');
let localStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
// reference the customers controller we created
var customers = require('./routes/customers');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
var conn = mongoose.connection;

// link to config file
var globals = require('./config/globals');

conn.open(globals.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport and sessions
app.use(session({
  secret: 'some salt value here',
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// link to the new Account model
let Account = require('./models/account');
passport.use(Account.createStrategy());

// facebook auth
let FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: globals.facebook.clientID,
        clientSecret: globals.facebook.clientSecret,
        callbackURL: globals.facebook.callbackURL,
        profileFields: [
            'id', 'displayName', 'emails'
        ]
    },
    function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return cb(err, user);
        });
    }
));

// google auth
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
        clientID:     globals.google.clientID,
        clientSecret: globals.google.clientSecret,
        callbackURL: globals.google.callbackURL,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return done(err, user);
        });
    }
));

let OutlookStrategy = require('passport-outlook').Strategy;

passport.use(new OutlookStrategy({
    clientID: globals.outlook.clientId,
    clientSecret: globals.outlook.clientSecret,
    callbackURL: globals.outlook.redirectUri
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {
      outlookId: profile.id,
      name: profile.DisplayName,
      email: profile.EmailAddress,
      accessToken:  accessToken
    };
    if (refreshToken)
      user.refreshToken = refreshToken;
    if (profile.MailboxGuid)
      user.mailboxGuid = profile.MailboxGuid;
    if (profile.Alias)
      user.alias = profile.Alias;
    Account.findOrCreate({username: profile.emails[0].value}, function (err, user) {
      return done(err, user);
    });
  }
));
// manage user login status through the db
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// routing goes after passport config so controllers can use passport
app.use('/', index);
app.use('/users', users);
app.use('/customers', customers); // handle all requests at /customers with customers router

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Skin Deep Tattoo',
      user: req.user
  });
});

 module.exports = app;
