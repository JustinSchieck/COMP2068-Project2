/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-04-05T12:13:19-04:00
 */



// express setup
let express = require('express');
let router = express.Router();

// link to the customer model for CRUD operations
let Customer = require('../models/customer');

// auth check
function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next(); // user is logged, so call the next function
   }

   res.redirect('/'); // not logged in so redirect to home
}

/* GET customers main page */
router.get('/', function(req, res, next) {

   // use mongoose model to query mongodb for all customers
   Customer.find(function(err, customer) {
      if (err) {
         console.log(err);
         res.end(err);
         return;
      }

      // no error so send the customers to the index view
      res.render('customers/index', {
         customer: customer,
         title: 'Customer List',
          user: req.user
      });
   });
});

// GET /customers/add - show blank add form
router.get('/add', isLoggedIn,  function(req, res, next) {
   // show the add form
   res.render('customers/add', {
      title: 'Customer Details',
       user: req.user
   });
});

// POST /customers/add - save the new customer
router.post('/add', isLoggedIn, function(req, res, next) {
   // use Mongoose to populate a new customer
   Customer.create({
     name: req.body.name,
     address: req.body.address,
     phone: req.body.phone
   }, function(err, customer) {
          if (err) {
             console.log(err);
             res.render('error');
             return;
          }
         res.redirect('/customers');
   });
});

// GET /customers/delete/_id - delete and refresh the index view
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
   // get the id parameter from the end of the url
   let _id = req.params._id;

   // use Mongoose to delete
   Customer.remove({ _id: _id }, function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/customers');
   });
});

// GET /customers/_id - show edit page and pass it the selected customer
router.get('/:_id', isLoggedIn, function(req, res, next) {
   // grab id from the url
   let _id = req.params._id;

   // use mongoose to find the selected customer
   Customer.findById(_id, function(err, customer) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('customers/edit', {
         customer: customer,
         title: 'Customer Details',
          user: req.user
      });
   });
});

// POST /customers/_id - save the updated customer
router.post('/:_id', isLoggedIn, function(req, res, next) {
   // grab id from url
   let _id = req.params._id;

   // populate new customer from the form
   let customer = new Customer({
      _id: _id,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone
   });

   Customer.update({ _id: _id }, customer,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/customers');
   });
});


// make this file public
module.exports = router;
