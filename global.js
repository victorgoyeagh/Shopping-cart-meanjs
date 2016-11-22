var express = require("express");
var path = require("path");


globals = {
	
	rootPath : function(){ 
		return path.dirname(__filename);
	},
	libraryPath : function(){
		return globals.rootPath() + "/public/assets/library/12345/";
	}

};


module.exports = globals;
