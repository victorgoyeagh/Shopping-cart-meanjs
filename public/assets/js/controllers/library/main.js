app.controller('library', ['$scope', 'FileUploader', function($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
}]);
 

app.service('fileService', ['$http', function($http){
	
	var file = {
		getFileInfo: function(){

			return $http.get("/api/getfileinfo");

		}

	};

	return file;
}]);


app.controller("treeController", ['$scope', 'RecursionHelper', 'fileService', function($scope, RecursionHelper, fileService) {
    

    	$scope.fileInfo = fileService.getFileInfo().success(function(response){
    		console.log("success " + response);
    	}).error(function(err){
    		console.log(err);
    	});

    $scope.treeFamily = {
        
        name : "Library",
        id: 2,
        parentId: 0,
        assetPath: '',
        orderNo: 0,
        folderType: 'folder',
        children: 
            [{
                name : "Child1",
                folderType: 'folder',
                children: 
                    [{
                        name : "Grandchild1",
                        folderType: 'file',
                        children: []
                    },
                    {
                        name : "Grandchild2",
                        folderType: 'folder',
                        children: []
                    },
                    {
                        name : "Grandchild3",
                        folderType: 'file',
                        children: []
                    }]
            }, 
            {
                name: "Child2",
                folderType: 'folder',
                children: 
                [{
                        name: "Child2-2",
                        folderType: 'folder',
                        children:  
                            [{
                                name : "Grandchild1",
                                folderType: 'file',
                                children: []
                            },
                            {
                                name : "Grandchild2",
                                folderType: 'file',
                                children: []
                            },
                            {
                                name : "Grandchild3",
                                folderType: 'file',
                                children: []
                            }]
                }]
            }]
        };
        
  }]);
  
  app.directive("tree", function(RecursionHelper) {
    return {
        restrict: "A",
        scope: {family: '='},
        template: 
        	'<span>{{ family.name }}</span>'+
            '<ul ng-show="{{ family.children.length > 0 }}">' + 
                '<li class="{{ child.folderType }}" ng-repeat="child in family.children">' + 
                    '<div tree family="child"></div>' +
                '</li>' +
            '</ul>',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        }
    };
  });
 