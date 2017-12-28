(function ($) {

    // Controls the $(document) binding
    let initialized = false,
        $self       = {};

    // Initilize the plugin
    $.fn.tinyTooltip = function () {

        // On hovre, create and show tooltip
        this.off("mouseover").on("mouseover", function (event) {
            $self = $(this);

            // Remove all old tooltips
            removeTooltips();

            // Remove active class from tooltips
            if ($self.hasClass('active')) {
                $self.removeClass('active');
                return false;
            }
            $('.tooltip.active').removeClass('active');

            // Initialize some variables
            let width  = $self.width(),
                offset = $self.offset(),
                top    = offset.top,
                left   = offset.left + (width / 2),
                text   = $self.attr('data-tooltip');

            // Set active class to the actual tooltip element
            $self.addClass('active');

            // Creates the tooltip span element
            let $tooltip = $('<span>', {
                class: 'tiny-tooltip-text',
                text : text
            }).css({
                visibility: 'visible',
            });

            // Appends the element to the body
            $('body').append($tooltip);

            // Get element infos
            let tooltipTop       = top - $tooltip.height() - 14,
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
                width    : tooltipWidth,
            });
        }).off('mouseout').on('mouseout', function () {
            $self.removeClass('active');
            removeTooltips();
        });

        touchDevicesFallback();

        return this;
    };

    function touchDevicesFallback() {
        if (!initialized) {
            $(document).on("touchstart", function (event) {
                if (!$(event.target).hasClass('tooltip') && $('.tiny-tooltip-text').length) {
                    removeTooltips();
                }
            });
            initialized = true;
        }
    }

    function removeTooltips() {
        let $tooltip = $('.tiny-tooltip-text');
        $tooltip.css({
            opacity: 0,
        });
        setTimeout(function () {
            $tooltip.remove();
        }, 500);
    }

}(jQuery));