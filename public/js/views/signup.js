$(document).ready(function(){


	$('#signup').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){

			return true;

		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/';
		},
		error : function(e){
		console.log(e);
		console.log(e.responseText);

		if(e.responseText === "userExists")
			//alert("El usuario ya existe");
			Materialize.toast("El usuario ya existe", 5000);

		if(e.responseText === "emailExists")
			//alert("El email ya está en uso");
			Materialize.toast("El email ya existe", 5000);

		if(e.responseText === "invalidKey")
			//alert("Clave inválida");
			Materialize.toast("Clave no autenticada", 5000);
		}
	});


});

	var query = window.location.search.substring(5);
	$('#keyp').val(query);

// create angular app
	var validationApp = angular.module('validationApp', []);

	// create angular controller
	validationApp.controller('mainController', function($scope) {

		// function to submit the form after all validation has occurred
		$scope.submitForm = function() {

			// check to make sure the form is completely valid
			if ($scope.userForm.$valid) {
				//alert('Bienvenido');
			}

		};

	});

	angular.module('validationApp').directive("passwordConfirm", function() {
    "use strict";
    return {
        require : "ngModel",
        restrict : "A",
        scope : {
            //We will be checking that our input is equals to this expression
            passwordConfirm : '&'
        },
        link : function(scope, element, attrs, ctrl) {
            //The actual validation
            function passwordConfirmValidator(modelValue, viewValue) {
                return modelValue == scope.passwordConfirm();
            }
            //Register the validaton when this input changes
            ctrl.$validators.passwordConfirm = passwordConfirmValidator;
            //Also validate when the expression changes
            scope.$watch(scope.passwordConfirm, ctrl.$validate);
        }
    };
});

	angular.module('validationApp').directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});
