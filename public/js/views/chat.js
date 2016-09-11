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
    socket.on('newConnection', function(msg) {
        $('#messages').append($('<li>').text("Se conecto el usuario : "+msg).css('font-style','italic'));
        $('#userlist').append($('<li>').text(msg));


    });


    $("#custom").spectrum({
    color: "#f00"
    });
