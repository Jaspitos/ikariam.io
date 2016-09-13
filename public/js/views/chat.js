    /**
     *@Authors: Javier y Lorenzo
     *@Desc: Creates sockets communication with server-side
     */

    var socket = io('/chatNsp');
    var sound = $('.playSound');

    $('form').submit(function() {
        var chosen_color = $('.sp-preview-inner').css("background-color");
        socket.emit('chat message', {message:$('#m').val(), color:chosen_color});
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg.user+" : "+msg.text.message).css('color',msg.text.color));//Writes socket message
        sound.trigger('load');
        sound.trigger('play');
        $('#chatparent').scrollTop(1000000);//Focus the scroll to bottom side
        setTimeout(function() {sound.trigger('pause'); sound.prop("currentTime", 0);}, 1120);
    });

    socket.on('newConnection', function(usr, clientes) {
        $('#messages').append($('<li>').text(usr+ " se ha conectado.").css('font-style','italic'));
        $('#userlist').empty();
        $.each(clientes, function(index, value){
            $('#userlist').append($('<li>').text(value));
        })
    });

    socket.on('disconnect', function(msg, clientes) {
      if(msg != 'io server disconnect')
      {
        $('#messages').append($('<li>').text(msg+" se ha desconectado.").css('font-style','italic'));
        $('#userlist').empty();
        $.each(clientes, function(index, value){
            $('#userlist').append($('<li>').text(value));
          })
      }
      else
        $('#messages').append($('<li>').text("Conexión rechazada: ya estás dentro del chat").css('font-style','italic'));

      });

    $("#custom").spectrum({
        color: "#f00"
    });
