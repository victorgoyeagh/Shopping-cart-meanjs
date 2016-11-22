var express = require("express");
var http = require("http");
var bp = require("body-parser");
var mongoose = require("mongoose");
//var schema = require("../models/contactsdb"); 
//var Contact = mongoose.model("Contact", schema.contactSchema, "contactlist");

var schemas = require("../models/schemas");
var conn = require("../models/dbconnect");
var Contact = conn.contactdb.model('Contact', schemas.contactSchema, "contactlist");


module.exports = {

	//get all contacts
	getcontactlist : function (request, response) { 
	  
	    Contact.find({ }, function (err, docs) {
	    	
	    	if(!err){
	        	response.send(docs);
	    	} else {
	    		response.send(err).end();
	    	}
	    });

	}, //add contacts
	postcontactlist : function(request, response){

		console.log(request.body);

		var contact = new Contact(request.body);

		contact.save(function(err, docs){ 

			if(err){
				var errorMsg = "error: " + err.message; 
				response.status(500).send(err);
			
			} else {  
				response.send(docs._id).end();
				//console.log("request: " + request.body );
			}

		});

	}, //delete contact
	deletecontactlist : function (request, response) {

	    Contact.findByIdAndRemove({ _id : request.query._id }, function (err, docs) { 
	        
	        if(err){
	        	response.send(err).end();
	        } else {
			  	//console.log("Contact: " + request.query.name + " was deleted"); 
				response.send(request.query._id).end();
	        }
	    });

	}, //update
	updatecontacts : function(request, response){

		var id = request.query._id;
		var contact = 
		{ 
			name : request.query.name, 
			email : request.query.email,
			number : request.query.number
		};

		Contact.findByIdAndUpdate(id, contact, { new: true }, function (err, doc){

			if(err){
				response.send(err).end();
			} else {
				console.log("Success update");
			}		
		});

	}

};

