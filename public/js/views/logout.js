$(document).ready(function(){

    var gamboa = this;

    $('#logout').click(function() {gamboa.attemptLogout(); });

    gamboa.attemptLogout = function()
    {
      var javier = this;
      $.ajax({
          url:"/logout",
          type:"POST",
          data:{logout: true},
          success: function(data){
            if(data == 'deleted') window.location.href = '/';
          },
          error : function(e){
      			console.log(e.responseText);
          }
      })
    }
});
