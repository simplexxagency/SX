$(document).ready(function () {
    var $window = $(window);
    var windowHeight = $window.height();
    var windowWidth = $window.width();

    var pageHeight = $('main').outerHeight();
    var $progressBar = $('.progress-bar');


    var $header = $('header');
    var $lightOn = $('.light-on');
    var $lightOff = $('.dark-on');
    var $body = $('body');
    var $loader = $('.loader');
    var $loaderColor1 = $('.load-color-1');
    var $loaderColor2 = $('.load-color-2');


    // horizontal scroll ------------
    var $horizontalScrollWrapper = $('.horizontal-scroll-wrapper');
    var horizontalScrollWrapperDivWidth = $('.horizontal-scroll-wrapper div').width();
    var horizontalScrollWrapperWidth = $horizontalScrollWrapper.width();

    var secondScreenHeight = horizontalScrollWrapperWidth;

    // calculate the width of the progress bar during a scroll:
    // getting maximum scroll top, this will be equal to 100%
    var maxScroll = pageHeight + secondScreenHeight - windowHeight;

    var scrollEnd = horizontalScrollWrapperWidth - horizontalScrollWrapperDivWidth;

    var $secondScreen = $('#second-screen');

    $secondScreen.css({
         'height': secondScreenHeight + 'px'
    });

    var translate = 0;

    $window.scroll(function(event){

        var scrollTop = $(this).scrollTop();
        var scrollScopeAction = scrollTop - windowHeight;

        if(scrollScopeAction > 0 && scrollScopeAction < scrollEnd) {
            $horizontalScrollWrapper.css({
                 'transform': 'translate3d(-'+ scrollScopeAction + 'px, 0px, 0px)'
            });
        };
        // horizontal scroll END
        // PROGRESS BAR

        // taking a percent of the current scroll using the proportion
        var percent = scrollTop * 100 / maxScroll;
        // substituting received percent to width of progress line
        $progressBar.width(percent + '%');

        // console.log(percent + ' %');

    });


    $('.link-wrp').hover(
        function() {
            $('.link-prev').removeClass('hover-active');
            $( this ).find('.link-prev').addClass('hover-active');
            // получем идентификатор блока из атрибута href
            var prevClass  = $(this).attr('data-text');
            var $elPrevClass  = $('div.' + prevClass + '');
            console.log($elPrevClass);
            $('.prev-bg').removeClass('active');
            $elPrevClass.addClass('active');
          }
      );


    // TEST scroll END -----------

    function loaderEnd () {
        $loader.fadeOut(200);
        setTimeout(function() {
            $loaderColor1.removeClass('show-content');
            $loaderColor2.removeClass('show-content');
        }, 200);

    };

    function loaderInStart () {
        $loaderColor1.addClass('show-content');
        setTimeout(function() {
            $loaderColor2.addClass('show-content');
        }, 200);
        setTimeout(loaderEnd, 900);
    };
    function loaderTransition () {
        $loader.fadeIn(200);
        setTimeout(function() {
            $loaderColor1.addClass('show-content');
        }, 200);
        setTimeout(function() {
            $loaderColor2.addClass('show-content');
        }, 400);
        setTimeout(loaderEnd, 1100);
    };

    loaderInStart ();

    // soft scroll to block
    $(".scrollTo").on("click", function (event) {
        // исключаем стандартную реакцию браузера
        event.preventDefault();
        loaderTransition ();
        // получем идентификатор блока из атрибута href
        var id  = $(this).attr('href'),
        // находим высоту, на которой расположен блок
            top = $(id).offset().top;
        // анимируем переход к блоку, время: 800 мс
        $('body,html').animate({scrollTop: top}, 500);
    });


    // Turn On - Turn Off
    $lightOn.click(function () {
        $body.addClass('light');
    });
    $lightOff.click(function () {
        $body.removeClass('light');
    });




        var lastScrollTop = 0;
        $(window).scroll(function(event){
            var st = $(this).scrollTop();
            if (st > lastScrollTop){
                $header.addClass('header-scrolled');
                $header.removeClass('header-show-scrolled');
            }
            else if (st < lastScrollTop && st > 0) {
                $header.addClass('header-show-scrolled');
            }
            else if (st == 0) {
                $header.removeClass('header-show-scrolled');
                $header.removeClass('header-scrolled');
            }
            lastScrollTop = st;
        });

        // init plugin
            NodeCursor({
                cursor : true,
                node : true,
                cursor_velocity : 1,
                node_velocity : 0.15,
                native_cursor : 'none',
                element_to_hover : '.nodeHover',
                cursor_class_hover : 'disable',
                node_class_hover : 'expand',
                hide_mode : true,
                hide_timing : 2000,
            });
});
