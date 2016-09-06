$(document).ready(function(){


	$('#signup').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){	
			
			return true;
			
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/caca';
		},
		error : function(e){
			console.log(e.responseText);
		}
	}); 
	
	/*Login form*/
	$('#login').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			
				return true;
			
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/pedo';
		},
		error : function(e){
			console.log(e.responseText);
		}
	}); 


});

// create angular app
	var validationApp = angular.module('validationApp', []);

	// create angular controller
	validationApp.controller('mainController', function($scope) {

		// function to submit the form after all validation has occurred			
		$scope.submitForm = function() {

			// check to make sure the form is completely valid
			if ($scope.userForm.$valid) {
				alert('our form is amazing');
			}

		};

	});
