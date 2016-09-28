$(document).ready(function() {
        $('.rmv-btn').click(function() {
            var usr2rmv = this.id;
            $('.user2rmv').html(usr2rmv);
            $('#input-rmv').attr('value', usr2rmv);
            $('#modal1').openModal();
        });

        $('#acept-rmv').click(function() {
            $('#form-rmv').submit();
        });
});
