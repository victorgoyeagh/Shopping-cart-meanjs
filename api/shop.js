var express = require("express");
var http = require("http");
var bp = require("body-parser"); 
var mongooseShop = require("mongoose"); 

var schemas = require("../models/schemas");
var conn = require("../models/dbconnect");
var Shop = conn.shopdb.model('Shop', schemas.shopSchema, "shop");

module.exports = {

	getcategories: function(request, response){

		Shop.find({ }).distinct('category', function(err, docs){ 

			response.send(docs); 
		});
	},
	getuniquebyproperty: function(request, response){
		
		var category = request.query.category;
		var property = request.query.property;

		Shop.find({ category : category }).distinct(property, function(err, docs){  
			response.send(docs); 
		});
	
	},
	getallproducts : function(request, response){

		Shop.find({ }, function(err, docs){ 
			response.send(docs);
		});

	},
	getproductsbycategory : function(request, response){

		var catToGet = request.query.category;
		Shop.find({ category : catToGet }, function(err, docs){
			response.send(docs);	
		});

	},
	getproductbyid : function(request, response){

		var query = request.query.productId;
		
		Shop.findById({ _id : query }, function(err, docs){

			if(!err){
				response.send(docs);
			} else {
				response.send(err);
			}
		});

	}

}