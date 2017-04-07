/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-03-27T14:16:57-04:00
 */




 let mongoose = require('mongoose');

 // create book schema (class)
 var customerSchema = new mongoose.Schema({
     name: {
         type: String,
         required: 'Name is required'
     },
     address: {
         type: String,
         required:'Address is required'
     },
     phone: {
         type: Number,
         min: 0
     }
 });

 // make it public
 module.exports = mongoose.model('Customer', customerSchema);
