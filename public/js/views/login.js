$(document).ready(function(){

	/*Login form*/
	$('#login').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){

				return true;

		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/';
		},
		error : function(e){
			console.log(e.responseText);
			Materialize.toast("El usuario o la contraseña es incorrecta", 5000);
		}
	});


});
