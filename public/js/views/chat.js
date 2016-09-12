    /**
     *@Authors: Lorenzo y Javier
     *@Desc: Creates sockets communication with server-side
     */

    var socket = io();
    $('form').submit(function() {
        var chosen_color = $('.sp-preview-inner').css("background-color");
        socket.emit('chat message', {message:$('#m').val(), color:chosen_color});
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg.user+" : "+msg.text.message).css('color',msg.text.color));
    });

    socket.on('newConnection', function(msg, clientes) {

        $('#messages').append($('<li>').text(msg+ " se ha conectado.").css('font-style','italic'));
        $('#userlist').empty();
        $.each(clientes, function(index, value){
            $('#userlist').append($('<li>').text(value));
        })
    });

    socket.on('disconnect', function(msg, clientes) {
      $('#messages').append($('<li>').text(msg+" se ha desconectado.").css('font-style','italic'));
      $('#userlist').empty();
      $('#userlist').append($('<li>').text(clientes));
      //$('#userlist').find('li:contains('+msg+')').remove();


      });


    $("#custom").spectrum({
    color: "#f00"
    });
