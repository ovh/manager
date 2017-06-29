/**
 *  @ngdoc directive
 *
 *  @name responsivePopover.directive:responsivePopoverClass
 *
 *  @description
 *  This directive manage the way the popover is displayed. This uses the configuration setted into the `responsivePopoverProvider` to detect if the popover needs to be displayed on full screen or to be displayed normally.
 *  It is automatically setted by `responsivePopover` directive.
 *
 *  **Note:** when ui-bootstrap version >= 2.0 will be used, the only thing to do should be to add a custom class with the 'popover-class' option of the uibPopover directive. To be tested.
 */
angular.module("ovh-angular-responsive-popover").directive("responsivePopoverClass", function (matchmedia, responsivePopover) {
    "use strict";

    return {
        restrict: "C",
        link: function (scope, iElement) {
            var mobileMediaQuery = responsivePopover.getMobileMediaQuery();
            var isMobileDetected = false;
            var mediaQueryHandler = false;
            var scrollPosition;
            var resetFixedBody = function (scrollTo) {
                $("body").removeClass("responsive-popover-fixed-body").css("top", "").scrollTop(scrollTo);
            };

            // on method returns a function that remove the media query listener
            // @see https://github.com/AnalogJ/matchmedia-ng/blob/master/matchmedia-ng.js#L75
            mediaQueryHandler = matchmedia.on(mobileMediaQuery, function (mediaQueryList) {
                isMobileDetected = mediaQueryList.matches;

                if (isMobileDetected) {
                    scrollPosition = $("body").scrollTop();
                    iElement.addClass("popover-full-screen");
                    $("body").css("top", scrollPosition * -1 + "px").addClass("responsive-popover-fixed-body");
                } else {
                    iElement.removeClass("popover-full-screen");
                    resetFixedBody(scrollPosition);
                }
            });

            scope.$on("$destroy", function () {
                // destroy media query listener
                mediaQueryHandler();

                // reset fixed body
                if (isMobileDetected) {
                    resetFixedBody(scrollPosition);
                }
            });
        }
    };

});
