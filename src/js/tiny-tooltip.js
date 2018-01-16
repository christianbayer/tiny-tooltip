(function ($) {

    // Check if the device supports touch
    let touchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),
        mouseOut    = true;
    let $elements = $();

    // Initilize the plugin
    $.fn.tinyTooltip = function (options) {
        let $self       = {},
            initialized = false,
            defaults    = {
                delay              : 0,
                class              : "",
                removeOnScroll     : true,
                rem                : parseInt($("body").css('font-size')),
                disableDelayOnTouch: true,
            },
            settings    = $.extend({}, defaults, options);

        this.each(function (i, el) {
            $elements.push(el);
        });

        // Remove tooltips on page scroll
        if (settings.removeOnScroll) {
            $(window).on("scroll", function () {
                $elements.removeClass('active');
                removeTooltips();
            });
        }

        // On touch or hover, create and show tooltip
        if (touchDevice) {
            if (settings.disableDelayOnTouch) {
                settings.delay = 0;
            }
            this.off("touchstart").on("touchstart", function (event) {
                $self = $(this);
                createTooltip();
            });

            if (!initialized) {
                // Bind to close the tooltip on another click on the screen
                $(document).on("touchstart", function (event) {
                    // If the target isn't a tooltip
                    if (!$(event.target).hasClass('tiny-tooltip') && $('.tiny-tooltip-text').length) {
                        $elements.removeClass('active');
                        removeTooltips();
                    }
                });
            }
        } else {
            this.off("mouseover").on("mouseover", function (event) {
                $self = $(this);
                mouseOut = false;
                createTooltip();
            }).off('mouseout').on('mouseout', function () {
                if ($self.length) {
                    $self.removeClass('active');
                }
                mouseOut = true;
                removeTooltips();
            });
        }


        let createTooltip = function () {
            // Remove all old tooltips
            removeTooltips();

            // Remove active class from tooltips
            if ($self.hasClass('active')) {
                $elements.removeClass('active');
                return false;
            }

            setTimeout(function () {
                if (!mouseOut || touchDevice) {
                    // Initialize some variables
                    let width  = $self.outerWidth(),
                        offset = $self.offset(),
                        top    = offset.top,
                        left   = offset.left + (width / 2),
                        text   = $self.attr('data-tooltip');

                    // Set active class to the actual tooltip element
                    $self.addClass('active');

                    // Creates the tooltip span element
                    let $tooltip = $('<span>', {
                        class: 'tiny-tooltip-text ' + settings.class,
                        text : text
                    }).css({
                        visibility: 'visible',
                    });

                    // Appends the element to the body
                    $('body').append($tooltip);

                    // Get element infos
                    let tooltipTop       = top - $tooltip.height() - settings.rem,
                        tooltipWidth     = $tooltip.outerWidth(),
                        halfTooltipWidth = tooltipWidth / 2,
                        tooltipLeft      = '3%',
                        tooltipRight     = '',
                        transform        = '',
                        windowWidth      = $(window).width();

                    // If the tooltip is offscreen on top
                    if (tooltipTop < 0) {
                        tooltipTop = 14;
                    }

                    // If the tooltip is offscreen on right or left
                    if (tooltipWidth < (windowWidth * .94)) {
                        if ((left + halfTooltipWidth) > windowWidth) {
                            tooltipLeft = '';
                            tooltipRight = '3%';
                        } else if ((left - halfTooltipWidth) < 0) {
                            tooltipLeft = '3%';
                        } else {
                            tooltipLeft = (left - halfTooltipWidth) + 'px';
                        }
                    }

                    // Adjust element attributes
                    $tooltip.css({
                        top      : tooltipTop,
                        left     : tooltipLeft,
                        right    : tooltipRight,
                        opacity  : 1,
                        transform: transform,
                    });
                }
            }, settings.delay);
        };

        let removeTooltips = function () {
            let $tooltip = $('.tiny-tooltip-text');
            $tooltip.css({
                opacity: 0,
            });
            setTimeout(function () {
                $tooltip.remove();
            }, 500);
        };

        return this;
    };

}(jQuery));