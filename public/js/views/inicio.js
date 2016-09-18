/**
 *@Authors: Javier y Lorenzo
 *@Desc: Creates sockets communication with server-side
 */

var socket = io('/inicioNsp');

socket.on('newConnection', function(usr, clientes) {
    $('#userlist').empty();
    $.each(clientes, function(index, value) {
        $('#userlist').append($('<li>').text(value));
    })
});

socket.on('disconnect', function(msg, clientes) {
    if (msg != 'io server disconnect') {
        $('#userlist').empty();
        $.each(clientes, function(index, value) {
            $('#userlist').append($('<li>').text(value));
        })
    }

});
