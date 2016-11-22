

angular.module("app").factory('dataFactory', ['$http', function ($http){
	
	var dataFactory = {

		getContactList: function(){
			return $http.get("/api/contacts");
		},
		addContact: function(newContact){
			return $http.post("/api/contacts", newContact);
		}

	};

	return dataFactory;
}]);


 

angular.module('app').controller('contactlist', ['$timeout', '$scope', '$http', '$routeParams', 'dataFactory', function ($timeout, $scope, $http, $routeParams, dataFactory){

 
	/*var defaultContact = {
		Name : "Winnie the Pooh",
		Email : "winniethepooh@gmail.com",
		Number : "09876654321"
	};*/

	var defaultContact = {
			Id : "",
			Name : "",
			Email : "",
			Number : ""
		};

	$scope.itemsPerPage = 5;
	$scope.add = true;
	$scope.sortKey = 'name';   
	$scope.reverse = false;
	$scope.noofesults = 5;


	$scope.Contact = defaultContact;
	

	//default obj
	$scope.init = function(){ 
		//get contact list
		dataFactory.getContactList().success(function(response){ 
		
			$scope.contacts = response;

		}).error(function(err){ 
			console.log(err);
		});
	};


 	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }
 
	//update contact
	$scope.updateContact = function(){

		var newContact = { 
			_id : $scope.hdnUpdateContactId,
			name : $scope.Contact.Name,
			email : $scope.Contact.Email,
			number : $scope.Contact.Number
		};

		var updId = $scope.hdnUpdateContactId;

		$http({ 
			url: "/api/contacts",
			method: "PUT",
			params: newContact

		}).success(function(){

			$scope.Status = "New contact: '" + newContact.name + "' was updated.";

		}).error(function(err){

			throw(err);

		});

		//update using index
		for(var i = 0; i < $scope.contacts.length; i++){

			if($scope.contacts[i]._id === updId){
				$scope.contacts[i] = newContact;
				$scope.hdnUpdateContactId = "";
				$scope.cancelEditContact();

				return;
			} 
		}
 
	};

	//ready edit mode
	$scope.setEditContact = function(contactToEdit){
 
		$scope.Contact = 
		{
			_id : contactToEdit.contact._id,
			Name : contactToEdit.contact.name,
			Email : contactToEdit.contact.email,
			Number : contactToEdit.contact.number
		};

		$scope.hdnUpdateContactId = contactToEdit.contact._id;
		$scope.add = false;
	};

	//delete contact
	$scope.DeleteContact = function(){
		 
		var contactName = { _id : this.contact._id };
		var delId = "";
		$http({ 
				method: 'DELETE',
				url: "/api/contacts",
				params: contactName

			}).success(function(response){
				
				delId = response;
				$scope.Status = "contact deleted";

			}).error(function(err){
				
				console.log(err);
				return false;
			
		});

		$scope.contacts.splice(this.$index, 1);
 
	};


	//add contact
	$scope.AddContact = function(){

		if($scope.contactform.$valid) {

			var newContact = 
			{
				name : $scope.Contact.Name,
				email : $scope.Contact.Email,
				number : $scope.Contact.Number
			};
				
			dataFactory.addContact(newContact).success(function(response){

				newContact._id = response;
				//console.log(response);
			
			}).error(function(error){
			
				console.log(error);
			
			});
			
			$scope.contacts.push(newContact);
			$scope.Contact = {};
			resetForm();

			$scope.Status = "New contact: '" + newContact.name + "' was successfully inserted.";

		} else {

			return;
		
		}
	};


	//helpers
	$scope.cancelEditContact = function(){
		resetForm();
	};

	$scope.revertStatusString = function(){
		$scope.Status = "";
	};

	var resetForm = function(){

		$scope.Contact = defaultContact;

		$scope.add = true;
		$scope.hdnUpdateContactId = "";
	};


} ]);