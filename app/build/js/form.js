// DISABLED BUTTON WITHOUT CHECKBOX
var $checkboxAgree = $('.checkbox-agree');
var $checkboxAgreeInput = $('.checkbox-agree input');

$checkboxAgree.on('change', function(){
    var $buttonCheckboxContainer = $(this).parent();
    var $checkboxAgreeInput = $(this).children('input[type="checkbox"]');
    var $thisButton = $buttonCheckboxContainer.find('input[type="submit"]');
    if($checkboxAgreeInput.is(':checked')) {
        $thisButton.removeClass('button-disabled');
        $thisButton.removeAttr('disabled')
    }
    else {
        $thisButton.attr('disabled', true);
        $thisButton.addClass('button-disabled')
    };
});

    // VALIDATION
    $('form').each(function(){
    // Объявляем переменные (форма и кнопка отправки)
        $(this).submit(function(e) {
            e.preventDefault();
            var form = $(this);
            var url = form.attr('action');
            var method = form.attr('method');
            var error = 0;

            $(form).find("input").each(function() {

                        var str = $(this).val();
                        var value = $.trim(str);

                        if($(this).hasClass('optional')) {
                            return true;
                        } else {
                            if(!value){
                                $(this).addClass('error');
                                error = 1;
                            }
                            else {
                                var str_length = value.length;
                                if($(this).attr('name') == 'name'){
                                    if(str_length < 2 || str_length > 36){
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    // else {
                                    //     $(this).removeClass('error');
                                    // }
                                    else {
                                        var regex = new RegExp(/^[а-яА-ЯёЁa]*$/);
                                        if(regex.test(value) == false) {
                                            error = 1;
                                            $(this).addClass('error');
                                        }
                                        else{
                                            $(this).removeClass('error');
                                        }
                                    }
                                }
                                if($(this).attr('name') == 'phone'){
                                    if(str_length < 10 || str_length > 20){
                                        error = 1;
                                        $(this).addClass('error');
                                    }
                                    else {
                                        $(this).removeClass('error');
                                    }
                                }

                            }
                        }
               })
            if(error) return 1;
        });

});
