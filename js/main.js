//
// Initalize Multilevel Nav
//

$('#mainNav').multilevelNav({
    'hoverIntent': true,
    'hoverIntentTimeout': 200,
    'autoDirection': true,
    // 'toggleOnClickOnly': true,
    'navbarMegaMenuBackdrop': true
});




//
// Replace page bg after a set amount of clicks
//

var replaceBodyBg = function(el, gifUrl, altText, clickCount) {
    var $this = el,
        origClickCount = clickCount,
        clickCounter = 0,
        replaceWithThisGif = gifUrl;

    $($this).on('click', function(){
        if (clickCounter >= origClickCount) {
            $('.l-body').css('background-image', 'url(' + replaceWithThisGif + ')');

            $('html').addClass('js-bg-replaced');
        }
        clickCounter++;
    });
};
replaceBodyBg('#raccoonImg', 'https://media.giphy.com/media/ifpqLMmOorPq0/giphy.gif', 'Raccoon rolling down hallway.', 15);




//
// Earbuds player
//

var budsCount = 0,
    clickCount = 0,
    ytIDIndex = 0,
    musicTrack,
    clickTimeout,
    randSoundID,
    soundIDArray = [
        'RBmoQSHfO2U?start=0&end=200', // Neil Cicierega: Annoyed Grunt
        'PNcCPTgoPSI?start=0&end=298', // RZA: Slow Blues (instrumental)
        'X4DE1wxgMwQ?start=0&end=171', // Party Favor: Wiggle Wop
        'mSHUIEDBbl4?start=0&end=131', // Neil Cicierega: 300mb
        'dQ4R30OhEAE?start=0&end=293', // 8 Bit Universe: Africa
    ];

$('<div class="js-buds-btn" id="budsBtn"></div>').appendTo('#robinImg');

$('#budsBtn').on('mouseup', function(){
    var $this = $(this);

    budsCount++;
    clickCount++;

    // Stop youtube iframe from playing without completely removing it
    $('.js-yt-iframe').removeAttr('src', '/');

    if (budsCount === 1) {
        ytIDIndex = Math.floor(Math.random()*soundIDArray.length);
        randSoundID = soundIDArray[ytIDIndex];
    } else {
        if (ytIDIndex === soundIDArray.length - 1) {
            ytIDIndex = 0;
        } else {
            ytIDIndex++;
        }
        randSoundID = soundIDArray[ytIDIndex];
    }

    var embedURL = 'https://www.youtube.com/embed/' + randSoundID + '&autoplay=1',
        startTime = parseInt(randSoundID.split('?')[1].split('start=')[1]),
        endTime = parseInt(randSoundID.split('?')[1].split('end=')[1]),
        totalTime = 0;

    totalTime = ((endTime - startTime) * 1000) + 1000;

    clearTimeout(musicTrack);

    if (clickCount === 1) {
        clickTimeout = setTimeout(function(){
            clickCount = 0;
        }, 300);

        if (budsCount === 1) {
            $('<iframe class="js-yt-iframe position-absolute" width="1" height="1" src="' + embedURL + '" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>')
                .insertAfter($(this));
        } else {
            $('.js-yt-iframe').attr('src', embedURL);
        }

        $this.css('cursor', 'pointer')
            .parent()
            .addClass('js-yt-playing');

        musicTrack = setTimeout(function(){
            $this.trigger('mouseup');
        }, totalTime);

    } else {
        clearTimeout(clickTimeout);
        clickCount = 0;
    }
}).on('dblclick', function(e){
    e.preventDefault();

    clearTimeout(musicTrack);

    $('.js-yt-iframe').attr('src', '/');

    $(this).parent().removeClass('js-yt-playing');
});




//
// Check if page is scrolled to the top or not with vanilla js
//

var checkScrollTop = function(el, className){
    if ( el.scrollTop > 0 ) {
        el.classList.add(className);
    } else {
        el.classList.remove(className);
    }
},
scrollable = document.documentElement;

checkScrollTop(scrollable, 'js-has-scrolled');

window.addEventListener('scroll', function() {
    checkScrollTop(scrollable, 'js-has-scrolled');
});




//
// Add snooper
//

var snooperFollower = function() {
    var snooper = $('.js-snooper');

    if (snooper.length) {

        // Cache selector and coordinates/widths initially
        var followBoundaryOffsetX = snooper.offset().left - (snooper.outerWidth() / 1.6);

        // Re-cache selector and coordinates/widths after screen width resize
        $(window).bind('resizeEnd', function() {
            followBoundaryOffsetX = snooper.offset().left - (snooper.outerWidth() / 1.6);
        });

        // Move the snooper elements
        $(window).mousemove(function(e){
            snooper.css({
                'left': e.pageX - followBoundaryOffsetX
            });
        });
    }
};

var snooperHtml = $('<div class="js-snooper">' +
        '<img class="js-snooper__mug" src="/images/mug.png" alt="">' +
    '</div>');

var snooperMouseIdle;

$('#squirrelImg').on('mouseenter', function(e){
    if ( !$('.js-snooper').length ) {
        snooperMouseIdle = setTimeout(function(){
            snooperHtml.insertAfter('.l-header');
            snooperFollower();
        }, 7000);
    }
}).on('mouseleave', function(){
    clearTimeout(snooperMouseIdle);
});




//
// Abductor
//

var abductEventEl = $('.cta-camp'),
    abductor = [
        'svg-bigfoot.svg',
        'svg-laptop-guy.svg',
        'svg-cow.svg'
    ];

var ufoTimer;
abductEventEl.on('mouseenter touchstart', function(){
    var $this = $(this),
        abductorSelected = Math.floor(Math.random() * abductor.length);
        ufoHTML = $('<img class="camp-element camp-element--ufo" src="/images/svg-ufo.svg?v3" alt="">' +
            '<div class="camp-element camp-element--ufo-beam">' +
                '<img src="/images/svg-ufo--beam.svg?v3" alt="">' +
                '<img class="camp-element camp-element--abductor" src="/images/' + abductor[abductorSelected] + '" alt="">' +
            '</div>');

    var eNum = 0,
        the51 = 102;
    $(document).on('keydown', function(e){
        eNum = e.which + eNum;

        if (eNum === the51) {
            if ($this.is(':hover')) {
                clearTimeout(ufoTimer);
                ufoHTML.insertAfter($this);
                $this.addClass('area-51');
            }
        } else if (eNum > the51) {
            eNum = 0;
        }
    });

    clearTimeout(ufoTimer);
    ufoTimer = setTimeout(function(){
        if ($this.is(':hover')) {
            ufoHTML.insertAfter($this);
            $this.addClass('area-51');
        }
    }, 2000);
}).on('mouseleave touchend', function(){
    clearTimeout(ufoTimer);
    $(this).removeClass('area-51');
    $('.camp-element--ufo').remove();
    $('.camp-element--ufo-beam').remove();
});


$(window).on('load', function(){
    $('.remove-on-load').removeClass('remove-on-load');

    $('.training')
        .addClass('js-training--active')
        .one('transitionend webkitTransitionEnd oTransitionEnd', function () {
            $(this).removeClass('js-training--active');
        });
});




//
// Konami code
//

var keyNum = 0,
    konamiNum = 583;
$(document).on('keydown', function(e){
    keyNum = e.which + keyNum;

    if (keyNum === konamiNum) {
        $('<iframe id="contraIntro" class="position-static" width="1" height="1" style="opacity: 0;" src="https://www.youtube.com/embed/0x4QnQbGdfU?autoplay=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>')
            .prependTo('body');

        setTimeout(function(){
            $('#contraIntro').remove();
        }, 10000);
    } else if (keyNum > konamiNum) {
        keyNum = 0;
    }
});
