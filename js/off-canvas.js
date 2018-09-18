(function($) {
    'use strict';

    var // Selector names
        classHeader = 'l-header',
        classOffCanvas = 'l-off-canvas',
        classCanvas = 'l-canvas',
        classToggleButton = 'toggle-off-canvas',
        classOffCanvasNavRight = 'off-canvas-right',
        classSiteHeaderFixed = 'has-header-fixed',
        classOffCanvasOverlay = 'l-off-canvas-overlay',
        classOffcanvasTransition = 'slide-over-transition',

        // Modifier classes
        classJsOffCanvasHidden = 'js-l-off-canvas-hide',
        classJsNavIn = 'js-off-canvas-showing',

        // Elements
        toggleBtn = $('.' + classToggleButton),
        offCanvasElement = $('.' + classOffCanvas),
        offCanvasContent = $('.' + classHeader),
        offCanvasOverlay = $('.' + classOffCanvasOverlay),
        offCanvasBody = $('body'),
        offCanvasCanvas = $('.' + classCanvas),

        // Misc
        headerHeight = $('.' + classHeader).outerHeight(),
        docScrollLoc = 0,
        currentLoc = 0,
        focusIndex = 0,
        focusBeforeOffCanvas,
        tapping = false,
        touchStartX,
        touchStartY,
        tabbableCount = 0,
        offCanvasBreakpoint = $('body').attr('data-off-canvas-breakpoint');

    // Get off canvas transition duration from css
    var offCanvasDuration = $('.' + classOffcanvasTransition).css('transition-duration').replace('s', '') * 1000;

    // Get browser width with or without scrollbar
    function viewport() {
        var e = window,
            a = 'inner';

        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    }

    // Resize delay
    var windowWidth = $(window).width();
    $(window).resize(function() {
        var newWindowWidth = $(window).width();

        if (windowWidth !== newWindowWidth) {
            if (this.resizeTO) {
                clearTimeout(this.resizeTO);
            }
            this.resizeTO = setTimeout(function() {
                $(this).trigger('resizeEnd');
            }, 150);
        }
        windowWidth = newWindowWidth;
    });

    // Check if is iOS device.
    function isiOS() {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            offCanvasBody.addClass('is-ios');
            return true;
        } else {
            return false;
        }
    }

    // Trap the keyboard to the off canvas elements when off canvas is showing
    function trapKeyboardToOC() {

        focusBeforeOffCanvas = $(':focus');

        var tabbable = offCanvasElement.find(
            'a[href],' +
            'area[href],' +
            'input:not([disabled]),' +
            'select:not([disabled]),' +
            'textarea:not([disabled]),' +
            'button:not([disabled]),' +
            'iframe,' +
            'object,' +
            'embed,' +
            '[tabindex="0"],' +
            '[contenteditable]'
        );

        var firstTabbable = tabbable.first();
        var lastTabbable = offCanvasElement.find('.js-tabfix');

        // Set focus on first input
        firstTabbable.focus();

        //Escape key press
        offCanvasElement.on('keydown', function(e) {
            var childShowingAmount = $(this).find('.mln__child--transitioning').length;

            if (e.keyCode === 27 && childShowingAmount === 0) {
                e.preventDefault();
                toggleOffCanvas('hide');
            }
        });


        // Redirect last tab to first input
        lastTabbable.on('keydown', function(e) {
            if (e.which === 9 && !e.shiftKey) {
                e.preventDefault();
                firstTabbable.focus();
            }
        });

        // Redirect first shift+tab to last input
        firstTabbable.on('keydown', function(e) {
            if (e.which === 9 && e.shiftKey) {
                e.preventDefault();
                lastTabbable.focus();
            }
        });

        // Focus on the off canvas element
        offCanvasElement.focus();
    }


    function toggleOffCanvas(action) {
        docScrollLoc = $(document).scrollTop();

        if (offCanvasBody.hasClass(classJsNavIn) || action === 'undefined' || action === 'hide') { // Close off canvas
            offCanvasBody.removeClass(classJsNavIn);

            // iOS Safari scroll canvas to the original canvas position
            if (isiOS() && offCanvasBody.hasClass(classSiteHeaderFixed)) {
                offCanvasCanvas.removeAttr('style');
                offCanvasBody.animate({
                    scrollTop: currentLoc
                }, 0);
            }

            // After off canvas is hidden
            setTimeout(function() {
                if(!offCanvasBody.hasClass(classJsNavIn)) {
                    offCanvasElement.addClass(classJsOffCanvasHidden);
                }
            }, offCanvasDuration);

            // Syncing aria-expanded attribute on the menu button
            toggleBtn.each(function(){
                $(this).attr('aria-expanded', 'false');
            });

            // Focus on off canvas button
            focusBeforeOffCanvas.focus();

        } else if (!offCanvasBody.hasClass(classJsNavIn) || action === 'show') { // Open off canvas

            offCanvasElement.removeClass(classJsOffCanvasHidden);

            // iOS Safari set location of canvas so the user doesn't lose where they are
            if (isiOS() && offCanvasBody.hasClass(classSiteHeaderFixed)) {
                offCanvasCanvas.css({
                    'top': -(docScrollLoc - headerHeight)
                });
            }

            offCanvasBody.addClass(classJsNavIn);
            currentLoc = docScrollLoc;

            // Syncing aria-expanded attribute on the menu button
            toggleBtn.each(function(){
                $(this).attr('aria-expanded', 'true');
            });

            trapKeyboardToOC();
        }
    }

    // Set height of the off canvas element
    function setOffCanvasHeight() {
        if (!$('body').hasClass('has-header-fixed')) {
            var offCanvasHeight = $('.l-off-canvas__helper').outerHeight(),
                surroundHeight = $('.l-surround').outerHeight(),
                setHeight;

            if (offCanvasHeight >= surroundHeight) {
                setHeight = offCanvasHeight;
            } else {
                setHeight = surroundHeight;
            }

            setTimeout(function(){
                if (viewport().width < offCanvasBreakpoint) {
                    $('.' + classOffCanvas).css('min-height', setHeight);
                } else {
                    $('.' + classOffCanvas).css('min-height', '');
                }
            }, 300);
        }
    }

    // Document ready
    $(document).ready(function() {

        // Build overlay that covers up the page content so it can't be interacted with when off canvas nav is enabled
        $('.l-surround').prepend('<div class="' + classOffCanvasOverlay + '"></div>');

        // Get X location of user touch
        offCanvasBody.bind('touchstart', function(e) {
            touchStartX = e.originalEvent.touches[0].clientX;
        });

        // If user touches and moves a bit, close the hide the off canvas
        offCanvasBody.bind('touchmove', function(e) {
            var touchRight = e.originalEvent.changedTouches[0].clientX;

            if (touchStartX - 80 > touchRight && offCanvasBody.hasClass(classJsNavIn) &&
                !offCanvasBody.hasClass(classOffCanvasNavRight) && tapping !== true) {
                toggleOffCanvas();
            } else if (touchStartX + 80 < touchRight && offCanvasBody.hasClass(classJsNavIn) &&
                offCanvasBody.hasClass(classOffCanvasNavRight) && tapping !== true) {
                toggleOffCanvas();
            }
        });

        offCanvasElement.addClass(classJsOffCanvasHidden)
            .append('<span class="js-tabfix" tabindex="0" aria-hidden="true"></span>');

        // If user clicks (or taps) close the off canvas nav
        $('.' + classToggleButton + ', .' + classOffCanvasOverlay).on('click', function() {
            toggleOffCanvas();
        });

        setOffCanvasHeight();
    });

    // Resizer
    $(window).bind('resizeEnd', function() {
        setOffCanvasHeight();
    });
}(jQuery));
