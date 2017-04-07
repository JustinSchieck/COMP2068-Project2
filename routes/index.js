/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-04-05T12:25:24-04:00
 */


var express = require('express');
var router = express.Router();

// add passport for reg and login
let passport = require('passport');
let Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home Page',
      user: req.user
  });
});

/* GET register */
router.get('/register', function(req, res, next) {
  // load the register.ejs view
  res.render('register', {
    title: 'Please Register',
      user: null
  });
});

/*GET about*/
router.get('/about', function(req, res, next) {
  // load the about.ejs view
  res.render('about', {
    title: 'About Skin Deep',
      user: null
  });
});

/*GET Contact*/
router.get('/contact', function(req, res, next) {
  // load the contact.ejs view
  res.render('contact', {
    title: 'Contact',
      user: null
  });
});

/*GET Portfolio*/
router.get('/portfolio', function(req, res, next) {
  // load the portfolio.ejs view
  res.render('portfolio', {
    title: 'Portfolio',
      user: null
  });
});


/* GET login */
router.get('/login', function(req, res, next) {

  let messages = req.session.messages || [];

  // clear messages from session
  req.session.messages = [];

  res.render('login', {
    title: 'Please Login',
    messages: messages,
      user: null
  });
});

/* POST register */
router.post('/register', function(req, res, next) {
  // use the Account model to create a new user account
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
      if (err) {
        console.log(err);
        res.render('error', { title: 'Create Account Error'});
      }
      res.redirect('/login');
    });
});

/* POST login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.logout();


  res.redirect('/');
});

/* GET facebook */
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

/* GET /facebook/callback */
router.get('/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      successRedirect: '/index',
        scope: 'email'

    })
);

/* GET /google - show google login prompt */
router.get('/google',
    passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
            , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
    ));

/* GET /google/callback - check login and redirect */
router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/customers',
        failureRedirect: '/login'
    }));

router.get('/auth/outlook',
  passport.authenticate('windowslive', {
    scope: [
      'openid',
      'profile',
      'offline_access',
      'https://outlook.office.com/Mail.Read'
    ]
  })
);

router.get('/auth/outlook/callback',
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/customers');
});

module.exports = router;
