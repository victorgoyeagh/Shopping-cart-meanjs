
var app = angular.module('app', ['ngRoute', 'ngResource', 'angularUtils.directives.dirPagination', 'ngAnimate', 'angularFileUpload', 'recursion']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { 
	$routeProvider
	.when("/", {
		templateUrl: "/views/home.ejs",
		controller: "home",
        onEnter: scrollContent
	}).when("/contacts", {
		templateUrl: "/views/applications/contacts/contacts.ejs",
		controller: 'contactlist',
        onEnter: scrollContent
	}).when("/about", {
		templateUrl: "/views/about.ejs",
		controller: "about",
        onEnter: scrollContent
	}).when("/asset-library", {
		templateUrl: "/views/applications/assetlibrary/asset-library.ejs",
		controller: "library",
        onEnter: scrollContent
	}).when("/shop", {
		templateUrl: "/views/applications/shop/shop.ejs",
		controller: "shopfront",
        onEnter: scrollContent
	}).when("/shop/products", {
		templateUrl: "/views/applications/shop/clothing/products.ejs",
		controller: "products",
        onEnter: scrollContent
	}).when("/shop/product", {
		templateUrl: "/views/applications/shop/clothing/product.ejs",
		controller: "product",
        onEnter: scrollContent
	}).when("/basket", {
		templateUrl: "/views/applications/shop/basket.ejs",
		controller: "product",
        onEnter: scrollContent
	}).otherwise({ 
		templateUrl: "/views/home.ejs",
		controller: "home",
        onEnter: scrollContent
	});

	//$locationProvider.html5Mode(true);

}]);

function scrollContent (){

	//var scrollTop = window.scrollTop();
	 window.scrollTo(0, 0);
	console.log(scrollTop);

};


app.controller('home', ['$scope', function ($scope){


}]);

app.controller('about', ['$scope', function ($scope){


}]);
