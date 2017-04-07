/**
 * @Author: Justin Schieck
 * @Date:   2017-03-27T12:42:06-04:00
 * @Email:  schieck91@gmail.com
 * @Last modified by:   Justin Schieck
 * @Last modified time: 2017-03-27T14:20:31-04:00
 */


let mongoose = require('mongoose');

// this is needed to tell the app this model is for managing user accounts; it is not a regular model like book
let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');

// create the schema.  username and password are automatically included
let accountSchema = new mongoose.Schema({});

// enable plm & findOrCreate on this model
accountSchema.plugin(plm);
accountSchema.plugin(findOrCreate);

// make the model public
module.exports = mongoose.model('Account', accountSchema);
