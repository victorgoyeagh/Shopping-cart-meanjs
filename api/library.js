var express = require("express");
var http = require("http");
var bp = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var globals = require("../global");

var schemas = require("../models/schemas");
var conn = require("../models/dbconnect");
var Library = conn.contactdb.model('Library', schemas.contactSchema, "library");


module.exports = {

	getfileinfo: function(request, response){

	 	fs.readdir(__dirname, function(err, files){

	 		var list = "";

	 		files.forEach(function(file){

	 			list += file + "\n";
	 		});

			response.send(list + globals.libraryPath());
			  
	 	});
 
	}
}