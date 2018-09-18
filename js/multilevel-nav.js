var mlnCurrent = 1;

(function($) {
    'use strict';

    $.fn.multilevelNav = function(options) {
        $(this).each(function() {
            var $this = $(this),

                // CSS class selector names
                classParent = 'mln',
                classNavbar = 'mln--navbar',
                classNavList = 'mln__list',
                classExpander = 'mln__expander',
                classHasChild = 'mln__has-child',
                classChildListNav = 'mln__child__nav',
                classToggleBtn = 'mln__toggle-btn',
                classToggleLink = 'mln__toggle-link',
                classToggleIndicator = 'mln__toggle-indicatior',
                classToggleBtnSymbol = 'mln__toggle-btn__symbol',
                classExpandBtn = 'mln__expand-btn',
                classChildCollapse = 'mln__child__collapse',
                classChildList = 'mln__child__list',
                classChildMega = 'mln__child__mega-menu',
                classHasChildShowing = 'mln__has-child--showing',
                classChildHasMega = 'mln__has-child--mega-menu',
                classChildOverflowVisible = 'mln__child--overflow-visible',
                classChildTransitioning = 'mln__child--transitioning',
                classExpanderShowing = 'mln__expander--showing',
                classExpanderTransitioning = 'mln__expander--transitioning',
                classChildExpandedOnLoad = 'mln__has-child--expand-on-load',
                classChildListFlowRight = 'mln__child--flow-right',
                classWholeLinkToggler = 'mln--whole-link-expand',
                classTopLevelWholeLinkToggler = 'mln--top-level-whole-link-expand',

                // Elements
                mlnParentList = $('.' + classNavList, $this),
                mlnExpander = $('.' + classExpander, $this),

                // Various
                dataBreakpoint = $this.attr('data-mln-breakpoint'),
                countChild = 1,
                countExpander = 1,
                isPageLoaded = false,
                settings,
                hoverTimeout,
                toggleBtnVerbiage = 'Toggle items under';

            // Setting defaults
            settings = $.extend({
                'hoverIntent': false,
                'hoverIntentTimeout': 250,
                'autoClose': true,
                'autoDirection': false,
                'toggleOnClickOnly': false,
                'expandActiveItem': false,
                'wholeLinkToggler': false,
                'topLevelWholeLinkToggler': false,
                'navbarMenuBackdrop': false,
                'navbarMegaMenuBackdrop': false,
                'activeSelector': '.active'
            }, options);

            // Toggle child menu(s)
            function mlnToggleChild(action, obj, animate) {
                var collapseHeight = 0,
                    mlnHasChild = obj.closest('.' + classHasChild),
                    mlnToggleChildCollapse = mlnHasChild.find('> .' + classChildCollapse + ':first'),
                    mlnParentLink = mlnHasChild.find('.' + classChildListNav + ':first a'),
                    ariaExpandedValue,
                    ariaHiddenValue,
                    mlnAnyShowing;

                // Figure out what aria values to use
                if (action === 'show') {
                    ariaExpandedValue = 'true';
                    ariaHiddenValue = 'false';
                } else if (action === 'hide' || action === undefined) {
                    ariaExpandedValue = 'false';
                    ariaHiddenValue = 'true';
                }

                // Grab height of inner collpase elements
                collapseHeight = $('.' + classChildCollapse + '__helper', mlnToggleChildCollapse).outerHeight();

                // Disable button while showing/hiding
                mlnHasChild.find('.' + classToggleBtn + ':first, .' + classToggleLink + ':first')
                    .attr('aria-expanded', ariaExpandedValue)
                    .css('pointer-events', 'none');

                // After showing/hiding is done, enable toggle button and parent link
                setTimeout(function() {
                    mlnHasChild.find('.' + classToggleBtn + ', .' + classToggleLink)
                        .css('pointer-events', '');
                }, childSpeed);

                // Show collapsible child elements
                if (action === 'show') {
                    mlnHasChild.addClass(classHasChildShowing);

                    mlnAnyShowing = $this.find('.' + classHasChildShowing);

                    // Add class to body for regular menu backdrop
                    if (mlnAnyShowing.length && $this.hasClass(classNavbar) &&
                        settings.navbarMenuBackdrop === true) {

                        $('body').addClass('js-menu-showing');
                    }

                    // Add class to body for mega menu backdrop
                    if (mlnHasChild.hasClass(classChildHasMega) &&
                        $this.hasClass(classNavbar) &&
                        settings.navbarMegaMenuBackdrop === true) {

                        $('body').addClass('js-mega-menu-showing');
                    }

                    if (animate === true) {
                        mlnToggleChildCollapse.addClass(classChildTransitioning)
                            .css('height', collapseHeight)
                            .attr('aria-hidden', ariaHiddenValue);

                        setTimeout(function() {
                            mlnToggleChildCollapse.css('height', 'auto')
                                .removeClass(classChildTransitioning)
                                .css('height', '');

                                if(mlnToggleChildCollapse.attr('data-hover-status') === 'on'){
                                    mlnToggleChildCollapse.addClass(classChildOverflowVisible);
                                }
                        }, childSpeed);
                    } else {
                        mlnToggleChildCollapse.css('height', 'auto')
                            .attr('aria-hidden', ariaHiddenValue)
                            .css('height', '')
                            .addClass(classChildOverflowVisible);
                    }
                }

                // Hide collapsible child elements
                if (action === 'hide') {
                    mlnHasChild.removeClass(classHasChildShowing);

                    mlnAnyShowing = $('.' + classNavbar).find('.' + classHasChildShowing);

                    if (!mlnAnyShowing.length && $('.' + classNavbar).length) {
                        $('body').removeClass('js-menu-showing');
                    }

                    if (mlnHasChild.hasClass(classChildHasMega) &&
                        !$('.' + classChildHasMega).hasClass(classHasChildShowing) &&
                        $this.hasClass(classNavbar)) {

                        $('body').removeClass('js-mega-menu-showing');
                    }

                    if (animate === true) {
                        mlnToggleChildCollapse.addClass(classChildTransitioning)
                            .removeClass(classChildOverflowVisible)
                            .attr('aria-hidden', ariaHiddenValue)
                            .css({
                                'height': collapseHeight,
                                'min-height': collapseHeight
                            });

                        setTimeout(function() {
                            mlnToggleChildCollapse.css({
                                'height': '',
                                'min-height': ''
                            });
                        }, 100);

                        setTimeout(function() {
                            mlnToggleChildCollapse.removeClass(classChildTransitioning);
                        }, childSpeed);
                    } else {
                        mlnToggleChildCollapse.removeClass(classChildOverflowVisible)
                            .attr('aria-hidden', ariaHiddenValue)
                            .css('height', '');
                    }
                }
            }

            // Show/Hide expander items
            function mlnToggleExpander(animate) {
                var collapseHeight = 0;

                if (viewport().width < dataBreakpoint && animate !== false) {
                    mlnExpander.children().each(function() {
                        collapseHeight = collapseHeight + $(this).outerHeight();
                    });

                    if (!mlnExpander.hasClass(classExpanderShowing)) {

                        mlnExpander.addClass(classExpanderTransitioning)
                            .addClass(classExpanderShowing)
                            .css('height', collapseHeight)
                            .attr('aria-hidden', 'false')
                            .parent().find('.' + classExpandBtn)
                            .attr('aria-expanded', 'true');

                        setTimeout(function() {
                            mlnExpander.css('height', 'auto')
                                .css('height', '')
                                .removeClass(classExpanderTransitioning);
                        }, expanderSpeed);

                    } else {
                        mlnExpander.addClass(classExpanderTransitioning)
                            .css('height', collapseHeight)
                            .attr('aria-hidden', 'true')
                            .parent().find('.' + classExpandBtn)
                            .attr('aria-expanded', 'false');

                        setTimeout(function() {
                            mlnExpander.removeClass(classExpanderShowing)
                                .css('height', '');
                        }, 100);

                        setTimeout(function() {
                            mlnExpander.removeClass(classExpanderTransitioning);
                        }, expanderSpeed);
                    }
                }

                // Adjust attributes without animating the expander menu
                if (animate === false) {
                    if (viewport().width < dataBreakpoint) {
                        mlnExpander.removeClass(classExpanderShowing)
                            .attr('aria-hidden', 'true')
                            .parent().find('.' + classExpandBtn)
                            .attr('aria-expanded', 'false');
                    } else {
                        mlnExpander.attr('aria-hidden', 'false')
                            .parent().find('.' + classExpandBtn)
                            .attr('aria-expanded', 'true');
                    }
                }
            }

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

            // Assign class to child items that run off the edge of the screen
            function assignFlowDirection() {
                if (settings.autoDirection === true) {
                    setTimeout(function(){
                        $('.' + classHasChild, mlnParentList).each(function() {
                            var $this = $(this),
                                mlnToggleChildOffset = ($this.offset().left -
                                    $('body').offset().left) + ($this.outerWidth() * 2);

                            if (mlnToggleChildOffset > viewport().width &&
                                viewport().width >= dataBreakpoint) {
                                $this.addClass(classChildListFlowRight);
                            } else {
                                $this.removeClass(classChildListFlowRight);
                            }
                        });
                    }, 300);
                }
            }

            // Keep items and parents with active class expanded on load
            function expandActiveItem() {
                if (settings.expandActiveItem === true) {
                    var activeItem = settings.activeSelector;

                    $(activeItem, mlnParentList).each(function() {
                        var $this = $(this);

                        $this.parents('.' + classHasChild).last()
                            .addClass(classChildExpandedOnLoad);

                        $this.parents('.' + classHasChild + '.' + classHasChild)
                            .addClass(classChildExpandedOnLoad);

                        $('.' + classChildExpandedOnLoad, mlnParentList).each(function() {
                            if (isPageLoaded === false ||
                                mlnParentList.closest('.' + classParent).hasClass(classNavbar) &&
                                viewport().width < dataBreakpoint &&
                                isPageLoaded !== true) {

                                mlnToggleChild('show', $(this), false);
                            }

                            if (mlnParentList.closest('.' + classParent).hasClass(classNavbar) &&
                                viewport().width >= dataBreakpoint) {

                                mlnToggleChild('hide', $(this), false);
                            }
                        });
                    });

                    isPageLoaded = true;
                }
            }

            // Start modifying the DOM
            if (mlnParentList.length) {

                // Get css transition time and convert to milliseconds
                mlnParentList.addClass(classChildTransitioning);
                var childSpeed = mlnParentList.css('transition-duration').replace('s', '') * 1000;
                mlnParentList.removeClass(classChildTransitioning);

                var expanderSpeed;
                if (mlnExpander.length) {
                    mlnExpander.addClass(classExpanderTransitioning);
                    expanderSpeed = mlnExpander.css('transition-duration').replace('s', '') * 1000;
                    mlnExpander.removeClass(classExpanderTransitioning);
                } else {
                    expanderSpeed = null;
                }

                // Open/close menu expander on smaller screen devices
                $('.' + classExpandBtn, $this).on('click', function() {
                    mlnToggleExpander();
                });

                // Find and modify mega menus
                mlnParentList.find('.' + classChildMega)
                    .wrap('<div class="' + classChildCollapse + '" />')
                    .wrap('<div class="' + classChildCollapse + '__helper" />')
                    .closest('li').addClass(classHasChild);

                // Add mega menu backdrop
                if (settings.navbarMegaMenuBackdrop === true) {
                    $('body').append('<div class="mln-backdrop"></div>');
                }

                // Find and modify child lists
                mlnParentList.find('ul').each(function(){
                    var $this = $(this);

                    if ($this.siblings('.' + classChildCollapse).length) {
                        var parentCollapse = $this.parent()
                            .find('.' + classChildCollapse + '__helper');

                        $this.addClass(classChildList)
                            .prependTo(parentCollapse);

                    } else if (!$this.closest('.' + classChildMega).length) {
                        $this.addClass(classChildList)
                            .wrap('<div class="' + classChildCollapse + '" />')
                            .wrap('<div class="' + classChildCollapse + '__helper" />')
                            .closest('li')
                            .addClass(classHasChild);
                    }
                });

                // Add modifier class to top level list items
                $(' > li', mlnParentList).each(function(){
                    $(this).addClass(classNavList + '__item--top-level');
                });

                // Add mega menu modifier class to top level
                if (mlnParentList.find('.' + classChildMega).length) {
                    mlnParentList.find('.' + classChildMega)
                        .closest('li')
                        .addClass(classChildHasMega);
                }

                // Wrap the parent <a> tag in it's own div
                $('.' + classHasChild, mlnParentList).each(function() {
                    var parentLink = $(this).find('> a');

                    parentLink.wrap('<div class="' + classChildListNav + '"></div>');
                });

                // Add a toggle button to list items with children
                $('.' + classChildListNav + '', mlnParentList).each(function() {
                    var $this = $(this),
                        siblingLink = $this.find('> a'),
                        linkText = siblingLink.text();

                    $this.append('<button class="' + classToggleBtn + '" type="button"> ' +
                        '<span class="' + classToggleBtnSymbol + '"></span> ' + toggleBtnVerbiage + ' ' + linkText + '</button>');
                });

                // Assign IDs and attributes to child menu elements
                $('.' + classChildCollapse, mlnParentList).each(function() {
                    $(this).attr('aria-hidden', 'true')
                        .attr('data-hover-status', 'off')
                        .attr('id', 'mln' + mlnCurrent + 'ChildCollapse' + countChild)
                        .parent().find('.' + classToggleBtn)
                        .attr('aria-expanded', 'false')
                        .attr('aria-haspopup', 'true')
                        .attr('aria-controls', 'mln' + mlnCurrent + 'ChildCollapse' + countChild);

                    countChild++;
                });

                // Assign IDs and aria attributes to expander elements
                mlnExpander.each(function() {
                    var $this = $(this);

                    $this.attr('aria-hidden', 'true')
                        .attr('id', 'mln' + mlnCurrent + 'Expander' + countExpander)
                        .parent().find('.' + classExpandBtn)
                        .attr('aria-haspopup', 'true')
                        .attr('aria-expanded', 'false')
                        .attr('aria-controls', 'mln' + mlnCurrent + 'Expander' + countExpander);

                    countExpander++;
                });

                // Whole link click expand and/or top level whole link expand
                if (settings.wholeLinkToggler === true || settings.topLevelWholeLinkToggler === true) {
                    var wholeObject;

                    if (settings.wholeLinkToggler === true) {
                        wholeObject = $('.' + classChildListNav + ' > a', mlnParentList);

                        $(mlnParentList).closest('.' + classParent)
                            .addClass(classWholeLinkToggler);
                    }

                    if (settings.topLevelWholeLinkToggler === true) {
                        wholeObject = $('> .' + classHasChild, mlnParentList)
                            .find('> .' + classChildListNav + ' > a') ||
                            $('> .' + classHasChild, mlnParentList)
                            .siblings('.' + classHasChild)
                            .find('> .' + classChildListNav + ' > a');

                        $(mlnParentList).closest('.' + classParent)
                            .removeClass(classWholeLinkToggler)
                            .addClass(classTopLevelWholeLinkToggler);
                    }

                    wholeObject.each(function() {
                        var $this = $(this),
                            closestToggleBtn = $(this).closest('.' + classHasChild)
                                .find('.' + classToggleBtn + ':first'),
                            ariaExpandedValue = closestToggleBtn.attr('aria-expanded'),
                            ariaControlsValue = closestToggleBtn.attr('aria-controls'),
                            ariaHasPopupValue = closestToggleBtn.attr('aria-haspopup');

                        $('<div class="' + classToggleIndicator + '">' +
                            '<span class="' + classToggleBtnSymbol + '"></span></div>')
                            .appendTo($this);

                        $this.addClass(classToggleLink)
                            .attr('role', 'button')
                            .attr('aria-expanded', ariaExpandedValue)
                            .attr('aria-controls', ariaControlsValue)
                            .attr('aria-haspopup', ariaHasPopupValue)
                            .on('click', function(e) {
                                $this.focus();
                                e.preventDefault();
                                closestToggleBtn.trigger('click');
                            });
                    });
                }

                // Toggle-button click
                $('.' + classToggleBtn, mlnParentList).on('click', function(e) {
                    var $this = $(this),
                        hasChildParent = $this.closest('.' + classHasChild),
                        associatedMenu = $this.closest(hasChildParent)
                            .find('.' + classChildCollapse + ':first'),
                        hasChildSiblings = hasChildParent.parent()
                            .find('.' + classHasChildShowing)
                            .not(hasChildParent);

                    if (viewport().width >= dataBreakpoint && settings.autoClose === true) {
                        associatedMenu.attr('data-hover-status', 'off');
                        mlnToggleChild('hide', hasChildSiblings, true);
                    }

                    if ($this.closest('.' + classHasChild).hasClass(classHasChildShowing)) {
                        mlnToggleChild('hide', $this, true);
                        associatedMenu.attr('data-hover-status', 'off');
                    } else {
                        mlnToggleChild('show', $this, true);
                        associatedMenu.attr('data-hover-status', 'on');
                    }
                });

                // Show/hide child menus with hoverIntent or just regular hover
                if (settings.hoverIntent === true && settings.toggleOnClickOnly === false) {
                    $('.' + classHasChild, mlnParentList).each(function() {
                        var $this = $(this),
                            associatedMenu = $this.find('.' + classChildCollapse + ':first');

                        $this.hoverIntent({
                            over: function() {
                                associatedMenu.attr('data-hover-status', 'on');
                                if (viewport().width >= dataBreakpoint) {
                                    mlnToggleChild('show', $this, true);
                                }
                            },
                            timeout: settings.hoverIntentTimeout,
                            out: function() {
                                associatedMenu.attr('data-hover-status', 'off');
                                if (viewport().width >= dataBreakpoint && associatedMenu.attr('aria-hidden') === 'false') {
                                    mlnToggleChild('hide', $this, true);
                                }
                            },
                            delay: settings.hoverIntentTimeout
                        });
                    });
                } else if (settings.toggleOnClickOnly === false) {
                    $('.' + classHasChild, mlnParentList).each(function() {
                        var $this = $(this),
                            associatedMenu = $this.find('.' + classChildCollapse + ':first');

                        $this.hover(function() {
                            if (viewport().width >= dataBreakpoint) {
                                if ($(this).closest('.' + classHasChild).hasClass(classHasChildShowing)) {
                                    associatedMenu.attr('data-hover-status', 'off');
                                    mlnToggleChild('hide', $(this), true);
                                } else {
                                    associatedMenu.attr('data-hover-status', 'on');
                                    mlnToggleChild('show', $(this), true);
                                }
                            }
                        });
                    });
                }

                // Keyboarding
                mlnParentList.each(function(){
                    var $this = $(this);

                    if ($this.closest('.' + classParent).hasClass(classNavbar)) {
                        $this.attr('data-parent-has-navbar', 'true');
                    }

                    var dataNavbar = $('[data-parent-has-navbar]');

                    $this.on('keydown', function(e){
                        var pressedKeyCode = e.keyCode;

                        // Escape key pressed
                        if (pressedKeyCode === 27) {
                            var eTarget = $(e.target),
                                associatedMenu = eTarget.closest('.' + classHasChildShowing);

                            // Set focus on parent toggle button
                            if (associatedMenu.length) {
                                associatedMenu.closest('.' + classHasChild).find('.' + classToggleBtn + ', .' + classToggleLink).get(0).focus();

                                // Hide associated or closest parent menu
                                mlnToggleChild('hide', associatedMenu, true);
                            }
                        }
                    });

                    // Close active navbar menu if focus is outside of it
                    $(document).on('focusin', function(e){
                        if ($(document.activeElement).closest('[data-parent-has-navbar]').length === 0 && viewport().width >= dataBreakpoint ) {
                            mlnToggleChild('hide', dataNavbar.find('.' + classHasChildShowing), true);
                        }
                    });
                });

                // Close all child menus if clicking off of the menu
                $(document).on('click', function(e) {
                    if ($(e.target).closest('.' + classNavList + ' > li, .' + classExpandBtn + '', $this).length === 0 &&
                        settings.autoClose === true &&
                        viewport().width >= dataBreakpoint &&
                        settings.expandActiveItem === false &&
                        !$('body').find('.' + classChildTransitioning).length) {

                        mlnToggleChild('hide', $('.' + classHasChildShowing, $this), true);
                    }
                });

                // Resizer
                $(window).bind('resizeEnd', function() {
                    if (viewport().width >= dataBreakpoint && settings.autoClose === true &&
                        settings.expandActiveItem === false) {

                        mlnToggleChild('hide', $('.' + classHasChildShowing, $this), false);
                        mlnExpander.css('height', '')
                            .removeClass(classExpanderShowing);
                    }

                    // Run functions after resize
                    expandActiveItem();
                    mlnToggleExpander(false);
                    assignFlowDirection();
                });

                // Run functions on load
                expandActiveItem();
                mlnToggleExpander(false);
                assignFlowDirection();
            }
            mlnCurrent++;

            $this.removeClass('mln--js-loading');
        });
    };
}(jQuery));
