var app = angular.module("app");
 

app.factory('productFactory', ['$http', function($http){
	
	var productFactory = {
		
		getcategories: function(){
			return $http.get("/api/getcategories");
		},
		getuniquebyproperty: function(category, property){
			return $http.get("/api/getuniquebyproperty?category=" + category + "&property=" + property);
		},
		getproductsbycategory: function(category){
			return $http.get("/api/getproductsbycategory?category=" + category);
		},
		getproductbyid: function(productId){
			return $http.get('/api/getproductbyid?productId=' + productId)
		}
	};

	return productFactory;
}]);


app.directive("ngBasket", ['shopService', 'imageService', function(shopService, imageService){

	return {
		restrict: "A",
		templateUrl: "/views/applications/shop/includes/basket.html",
		scope: true,
		link: function(scope, el, attr){
		},
		controller: ['imageService', '$timeout', '$scope', '$element', '$attrs', 'shopService', function(imageService, $timeout, $scope, $element, $attrs, shopService){

			//hack... remove zoom container
			$timeout(function(){
				
				$(".content").mCustomScrollbar();
				
				if($('.zoomContainer'))
					$('.zoomContainer').remove();
			
			}, 200);

			var items = shopService.getItems();
			$scope.products = items;

			$scope.advanced = false;
			$scope.showBasket = false;

			$scope.getImagePath = function(col, productImages){
				$scope.imagePath = imageService.getColIndex(col, productImages);

				return $scope.imagePath;
			};

			$scope.advanced = ($attrs.ngBasket == 'advanced');

			$scope.getDefaultImage = function(images){
				return imageService.getDefaultImage(images); 
			};

			$scope.showMeBasket = function(){
				$scope.showBasket = !$scope.showBasket;
			};
 
			$scope.clearBasket = function(){
				$scope.products = shopService.clearBasket();
			};

			$scope.removeItemByBasketId = function(basketId){
				shopService.removeItemByBasketId(basketId);
			};

			$scope.$on('basketLoaded', function () {
		        $scope.products = shopService.basketItems;
			});
			
		}]
	}

}]);


app.service("shopService", function($rootScope){

    var shop = {};

    shop.basketItems = {};

    shop.passData = function(basketData){
        shop.basketItems = basketData;
        $rootScope.$broadcast('basketLoaded');
    };

    shop.getItems = function(){
    	return (localStorage.getItem("basket")) ? JSON.parse(localStorage.getItem("basket")) : [];
    };

    shop.removeItemByBasketId = function(basketId){
    	var remainItems = [];
    	var items =  shop.getItems();

		remainItems = items.filter(function(item){
		    return item.userOptions.id !== basketId;
		});

		localStorage.setItem("basket", JSON.stringify(remainItems));
    	shop.passData(remainItems);
    };

    shop.clearBasket = function(){
		var items = [];
		localStorage.setItem("basket", JSON.stringify(items));
        shop.passData(items);
    };

    shop.itemAlreadyAdded = function(item, items){

		var noFound = 0;

		for(var i = 0; i < items.length; i++){

			//console.log(items[i]._id, item._id, (items[i]._id == item._id));

			if(items[i]._id == item._id)
				noFound++;

		}

		return noFound;
    };

    shop.addToBasket = function(item, selCol, selSize){

		var items = shop.getItems();

		item.userOptions = {
			id : item._id + "_" + selCol + "_" + selSize + "_" + Date.now(),
			colour : selCol,
			size : selSize,
			count : 1
		}; 

		items.push(item);
		localStorage.setItem("basket", JSON.stringify(items));
        shop.passData(items);
    };

    return shop; 
});


app.controller("basketPage", ['$timeout', '$scope', function($timeout, $scope){

}]);

app.controller('product', ['imageService', '$timeout', '$route', '$rootScope', '$location', '$scope', '$http', 'productFactory', 'shopService', function(imageService, $timeout, $route, $rootScope, $location, $scope, $http, productFactory, shopService){
	
	$scope.chosenIndex = 0; 
	$scope.chosenColour = '';
	$scope.chosenSize = '';

	$scope.selectColour = function(col){ 
		$scope.chosenColour = col;
		$scope.chosenIndex = imageService.getColIndex(col, $scope.productdetails.images);
		$scope.previewImages();
	};

	$scope.selectSize = function(size){ 
		$scope.chosenSize = size; 
	};

	$scope.previewImages = function(){

		$timeout(function () {
			if($(".zoomWrapper").length > 0){
    	    	$(".mainzoom").unwrap();
    		}

			if($(".zoomContainer").length > 0){
				$(".zoomContainer").remove(); 
			}
            
            $(".mainzoom").elevateZoom({
                gallery:'gallery', 
                cursor: 'pointer',
                response: true,
                galleryActiveClass: "active", 
                imageCrossfade: true
            });

	        //plugin not updating main image, therefore faulty... so force zoom image after init... smh
			$timeout(function () {
				var src = $('#gallery').find('li:first-child a img').attr('src');
	            $(".zoomWindowContainer div").css({ "background" : "url(" + src + ")" });
	       	}, 100);
       	 

       	}, 500);

	};

	$scope.init = function(){
 
		items = localStorage.getItem('basket') || [];
		$scope.productFound = false;
		
		var productId = $location.search().productId;
		productFactory.getproductbyid(productId).success(function(response){
			
			if(!response){
				console.log("no product found");  
				return;

			} else { 
				
				$scope.productFound = true;

				$scope.productdetails = response;

				imageService.preloadImages($scope.productdetails.images);
				
				$timeout(function(){
					// set default colour 
					$scope.chosenColour = imageService.getInitialPropertyCol($scope.productdetails.images[0]);
					$scope.chosenIndex = imageService.getColIndex($scope.chosenColour, $scope.productdetails.images);

					$scope.previewImages();

					$timeout(function(){
						$scope.chosenSize = $(".sizes li.active").prop('title');
					}, 200);

				}, 400);

			}

		}).error(function(err){ 
			console.log(err); 
		});

	};

	$scope.addItemToBasket = function(item){
		shopService.addToBasket(item, $scope.chosenColour, $scope.chosenSize);
	};

}]);

app.controller('products', ['imageService', '$timeout','$rootScope','$location', '$scope', '$http', 'productFactory', function(imageService, $timeout, $rootScope, $location, $scope, $http, productFactory){
	
	$scope.showProductProperties = false;

	$scope.toggleProperties = function(){
		$scope.showProductProperties = !$scope.showProductProperties;
	};

	var category = $location.search().category;
	 
	$scope.itemsPerPage = 10;   
	$scope.sortVal = 'name';   
	$scope.reverse = false;
	$scope.sortKey = "null,false";

	$scope.sizes = [];
	$scope.colours = [];
	$scope.productnames = [];

	$scope.minSelPrice = 0;
	$scope.maxSelPrice = 100;
	$scope.minPrice = 0;
	$scope.maxPrice = 100; 

	$scope.subcat = "";

	$scope.selColours = [];
	$scope.selSizes = [];
	$scope.categories = [];

	$scope.init = function(){
 
		//load products
		$scope.category = category;
		$scope.foundCategory = false;

		productFactory.getproductsbycategory(category).success(function(response){  

			if(response.length == 0){
				
				productFactory.getcategories().success(function(response){
					$scope.categories = response;
				}).error(function(err){
					console.log("Something went wrong :(");
				}); 

				return;

			} else {

				$scope.foundCategory = true;
			
				$scope.products = response;

				$scope.subcategories = $.distinctObj($scope.products,'subcategory');

				$scope.sizes = getDistinct('sizes');

				$scope.colours = getDistinct('colours');

				$scope.productnames = $.distinctObj($scope.products,'name');

				$scope.price = $.distinctObj($scope.products,'price'); 

				$scope.minPrice = Math.floor((Math.min.apply(null, $scope.price)+1)/10)*10;
				$scope.maxPrice = Math.ceil((Math.max.apply(null, $scope.price)+1)/10)*10;

				$timeout(function(){
					
					$scope.minSelPrice = $scope.minPrice;
					$scope.maxSelPrice = $scope.maxPrice;

				 	$scope.$watch('minSelPrice',function(val,old){
				       $scope.minSelPrice = parseInt(val); 
				    });
	 
				}, 200);
			}

		}).error(function(err){ 
			console.log(err); 
		});

	};


	//search for first colour for product
	$scope.getDefaultImages = function(objArr){
		return imageService.getDefaultImages(objArr);
	}

	$scope.toggleColour = function(col){

		if (col != 'default'){
			if($.inArray(col, $scope.selColours) == -1){
				$scope.selColours.push(col);
			} else {
				$scope.selColours.splice($scope.selColours.indexOf(col), 1);
			}
		} else {
			$scope.selColours = [];
		}

	};

	$scope.toggleSize = function(size){

		if (size != 'default'){
			if($.inArray(size, $scope.selSizes) == -1){
				$scope.selSizes.push(size);
			} else {
				$scope.selSizes.splice($scope.selSizes.indexOf(size), 1);
			}
		} else {
			$scope.selSizes = [];
		}

	};

 	$scope.sort = function(value){ 
 
 		var vals = value.split(",");

	 	if(vals != '') { 
	        $scope.sortVal = ((vals[0] != null) ? vals[0].toString() : '');   
	        $scope.reverse = ((vals[1] != null) ? parseBool(vals[1]) : false);
	    }
    };


	var getDistinct = function(property){

		var arr = $.distinctObj($scope.products, property);

		var myArray = [];
		for(var i = 0; i < arr.length; i++){
			var colArr = arr[i];

			for(var a = 0; a < colArr.length; a++){
				if($.inArray(colArr[a], myArray) == -1){
					myArray.push(colArr[a]);
				}
			}
		}
		
		return myArray;
	};


	var parseBool = function(str) {

		if (str.length == null) {
			return str == 1 ? true : false;
		} else {
			return str == "true" ? true : false;
		}
	};

	$scope.hasSizes = function(colours){

		return function(input) {
		    
		    if($scope.selSizes.length == 0){
		    	return true;
		    }
			  
 			var hasSize = false;

		    for(var i = 0; i < $scope.selSizes.length; i++){
				for(var a = 0; a < input.sizes.length; a++){
					if(($scope.selSizes[i] == input.sizes[a])){
						hasSize = true;
						break;
					}
				} 
		    }

		    return hasSize;

		};
	}

	$scope.hasColours = function(colours){

		return function(input) {
		    
		    if($scope.selColours.length == 0){
		    	return true;
		    }
			  
 			var hasColour = false;

		    for(var i = 0; i < $scope.selColours.length; i++){
				for(var a = 0; a < input.colours.length; a++){
					if(($scope.selColours[i] == input.colours[a])){
						hasColour = true;
						break;
					}
				} 
		    }

		    return hasColour;

		};
	}


	$scope.greaterLessThan = function(from, to){
		return function(input) {
		  	if (!from) {
		      return true;
		    } 
		     
		    var itemPrice = input.price; 
	        
	        if (itemPrice > from && itemPrice < to)  { 
	    		return true;
	        }
	        else {
	        	return false;
	        }         
		};
	}

}]);



app.service('imageService', function(){

	var imageService = {
		preloadImages: function(imgArr){

			if(!imgArr){
				return;
			}

			var tmpImages = [];
			
			$.each(imgArr, function(index, el){
 
				$.each(el,function(index, innerEl){
					if($(innerEl).length > 0){

						for(var i= 0; i < innerEl.length; i++){

							var img = new Image(); 
							img.src = innerEl[i];
							img.alt = innerEl[i].toString().substring(innerEl[i].lastIndexOf("/"), innerEl[i].length);

							tmpImages.push(img);

						}
					}
				});
			});
			
			//console.log(tmpImages);

		},
		getDefaultImages : function(objArr){

			var defCol = "";

			var prop = imageService.getInitialPropertyCol(objArr);
			defCol = eval("objArr." + prop);  

			return defCol;
		},
		getInitialPropertyCol: function(objArr){

			var property = "";
			
			for (var prop in objArr) {
			    if (objArr.hasOwnProperty(prop)) {
			    	property =  prop;  
			    	//console.log(prop);
			        break;
			    }
			}
			return property;
		},
		getColIndex : function(col, objArr){

			var _index = 0;

			$.each(objArr, function(index, el){ 
				var currObj = eval("el."+col);
				if(currObj){
					_index = objArr.indexOf(el);
				}
			});

			return (_index) ? _index : 0;
		} 
	};

	return imageService;
});

 




app.filter("priceFilter", function() {
	return function(input, from, to) {
  	if (!from) {
      return input;
    }
    //console.log(input, from, to);
	    var result = [];        
	    for (var i = 0; i < input.length; i++){
	        var itemPrice = input[i].price;

	        if (itemPrice > from && itemPrice < to)  {
	            result.push(input[i]);
	        }
	    }            
	    return result;
	};
});



app.controller('shopfront', ['$rootScope', '$scope', '$http', 'productFactory', function($rootScope, $scope, $http, productFactory){

	$scope.init = function(){
		//load categories
		productFactory.getcategories().success(function(response){
			$scope.categories = response;
		}); 
	}; 

}]);


app.directive('ngSelect', ['$timeout', function($timeout) {
	return {
		restrict: 'A',   
       	scope: true,
		link: function(scope, element, attr){

			var selType = attr.ngSelect;

 			$timeout(function() {

                for (var i = 0; i < element[0].children.length; i++) {

                	var $option = $(element[0].children[i]); 
	 				$(element[0].children[0]).addClass('active'); 

                    $option.bind('click', function($event) {

						var $liCol = element.find('li');
						var liDefault = $(this).parent().find('li.default');
						var val = $(this).prop('title');

						if(val == 'default'){

		    	            $liCol.not(liDefault).removeClass('active');
		    	            $(liDefault).addClass('active');

		            	} else {

							var $liColsActive = $(this).parent().find('li.active');

							if(selType === 'single'){
								$liCol.removeClass('active');
							}

		            		if($(this).hasClass('active')){
		    	            	$(this).removeClass('active');
		            			
		            			if($liColsActive.length == 1){ //count how many active colours are left default back to all
		    	            		$(liDefault).addClass('active');
		            			}

		    	        	} else {

		    	            	$(liDefault).removeClass('active');
		    	            	$(this).addClass('active');
		    	        	}
		            	}
		            });
                }
            }, 200);

		}
	}
}]);

 