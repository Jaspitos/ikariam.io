    /**
     *@Authors: Javier y Lorenzo
     *@Desc: Creates sockets communication with server-side
     */

    var socket = io('/chatNsp');

    $('form').submit(function() {
        var chosen_color = $('.sp-preview-inner').css("background-color");
        socket.emit('chat message', {
            message: $('#m').val(),
            color: chosen_color
        });
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg.user + ": " + msg.text.message).css('color', msg.text.color)); //Writes socket message
        $('#chatparent').scrollTop(1000000); //Focus the scroll to bottom side
    });

    socket.on('newConnection', function(usr, clientes) {
      if(usr != 'yaExiste')
        $('#messages').append($('<li>').text(usr + " se ha conectado").css('font-style', 'italic'));

        $('#userlist').empty();
        $.each(clientes, function(index, value) {
            $('#userlist').append($('<li>').text("► "+value));
        })

    });

    socket.on('disconnect', function(msg, clientes) {
      if(msg != 'yaExiste') {
        $('#messages').append($('<li>').text(msg + " se ha desconectado").css('font-style', 'italic'));
        $('#userlist').empty();
        $.each(clientes, function(index, value) {
            $('#userlist').append($('<li>').text("► "+value));
        })
      }
    });

    $("#custom").spectrum({
        color: "#f00"
    });
