
var mongoose = require("mongoose"); 
var Schema = mongoose.Schema;

exports.contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String
}, 
{ 
	versionKey: false 
});


exports.shopSchema = new mongoose.Schema({

  "name": String,
  "description": String,
  "colours": [String],
  "price": Number,
  "category": String,
  "subcategory": String,
  "id": Number,
  "sizes": [String],
  "images":[{ Object : [String]}],
  "brand": String,
  "created": Date, //{type: Date,default: Date.now()},
  "inStock": Boolean,
  "onSale": Boolean
           
}, 
{ 
	versionKey: false
});