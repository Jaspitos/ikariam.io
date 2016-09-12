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
        $('#messages').append($('<li>').text(msg.user+" : "+msg.text.message).css('color',msg.text.color));//Writes socket message
        $('#chatparent').scrollTop(1000000);//Focus the scroll to bottom side
    });
    socket.on('newConnection', function(msg) {
        $('#messages').append($('<li>').text("Se conecto el usuario : "+msg).css('font-style','italic'));//Writes connection message
        $('#userlist').append($('<li>').text(msg));//User connection is added to userlist
    });

    socket.on('disconnected', function(msg) {
        $('#messages').append($('<li>').text("Se desconecto el usuario : "+msg).css('font-style','italic'));//Writes connection message
    });

    $("#custom").spectrum({
    color: "#f00"
    });
