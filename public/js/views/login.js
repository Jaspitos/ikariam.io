$(document).ready(function(){

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