var express = require("express");

exports.index = function(request, response){
 
	response.render("index", {
		title: "Glimpse"

	});

}; 

exports.view = function (request, response) {

  var name = request.params.name;
  response.render(name);

};