var mongoose = require("mongoose");
var schemas = require("./schemas");


//all connections share pool
var contactdb = mongoose.createConnection("mongodb://localhost/contactlist");
 
exports.shopdb = contactdb.useDb('shop');

exports.contactdb = contactdb;
 