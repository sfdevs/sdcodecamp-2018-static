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
        // 'c2HYDDkQi1Q?start=0&end=168', // DJ Kool: Let Me Clear My Throat (Party Favor remix)
        'RBmoQSHfO2U?start=0&end=200', // Neil Cicierega: Annoyed Grunt
        // 'PNcCPTgoPSI?start=0&end=298', // RZA: Slow Blues (instrumental)
        // 'X4DE1wxgMwQ?start=0&end=171', // Party Favor: Wiggle Wop
        // 'dQ4R30OhEAE?start=0&end=293', // 8 Bit Universe: Africa
        // 'mSHUIEDBbl4?start=0&end=131', // Neil Cicierega: 300mb
        // '5bPAJ8rg_Ws?start=14&end=227', // 8 Bit Universe: Bulls on Parade
        // 'HpfOTXuXOcE?start=0&end=309', // 8 Bit Universe: Killing In The Name
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
        '<img class="js-snooper__mug" src="assets/images/mug.png" alt="">' +
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

$(window).on('load', function(){
    $('.remove-on-load').removeClass('remove-on-load');
});
