/**
 *  @ngdoc overview
 *
 *  @name responsivePopover
 *
 *  @requires [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
 *  @requires [ui.bootstrap](https://angular-ui.github.io/bootstrap)
 *
 *  @description
 *  _`responsive-popover` module is used to display a popover and adapt it to the screen dimension._
 *
 *  The two major directives are:
 *      - the `responsivePopover` directive that will display a uibPopover to the DOM element you instanciate it;
 *      - the `responsivePopoverClass` directive that is added to the popover popup.
 *
 *  **Note:** when ui-bootstrap will be updated to version >= 2.0, it should be possible to remove `responsivePopover` directive and use uibPopover directive with custom class responsive-popover-class. So `responsivePopoverClass` directive will be the only directive of this component.
 *
 *  @usage
 *  Install module with bower:
 *  <pre>
 *  # bower install --save ssh://git@stash.ovh.net:7999/uxcomponents/responsive-popover.git
 *  </pre>
 *
 *  Then inject responsivePopover module in your module declaration:
 *  <pre>
 *  angular.module("myModule", [
 *      ...
 *      "responsivePopover",
 *      ...
 *  ]);
 *  </pre>
 */
(function () {
    "use strict";

    angular.module("ovh-angular-responsive-popover", ["matchmedia-ng", "ui.bootstrap"]);

})();

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
angular.module("ovh-angular-responsive-popover").directive("responsivePopoverClass", ["matchmedia", "responsivePopover", function (matchmedia, responsivePopover) {
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

}]);

angular.module("ovh-angular-responsive-popover").directive("responsivePopoverPopup", function () {
    "use strict";

    return {
        replace: true,
        scope: {
            uibTitle: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "ovh-angular-responsive-popover-popup/ovh-angular-responsive-popover-popup.html"
    };
});

/**
 *  @ngdoc directive
 *
 *  @name responsivePopover.directive:responsivePopover
 *
 *  @description
 *  This is the main directive of the `responsivePopover` module. In fact it's an extended uibPopover with an additional class applied to it's content template.
 *
 *  For available options, see the doc of [uibPopover](https://angular-ui.github.io/bootstrap/#/popover).
 *
 *  @example
 *  The following example will open a popover with the content of path/of/popover/content.html file inside. This popover will be closed when focus is lost inside of it.
 *  <pre>
 *  <button type="button"
 *          data-responsive-popover="'path/of/popover/content.html'"
 *          data-popover-placement="bottom-left"
 *          data-popover-trigger="focus">
 *  </button>
 *  </pre>
 */
angular.module("ovh-angular-responsive-popover").directive("responsivePopover", ["$uibTooltip", function ($uibTooltip) {
    "use strict";

    return $uibTooltip("responsivePopover", "popover", "click", {
        useContentExp: true
    });
}]);

/**
 * @ngdoc service
 * @name responsivePopover.responsivePopoverProvider
 *
 * @description
 * responsivePopoverProvider allows developper to configure which mediaQuery will be considered as a mobile.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (responsivePopoverProvider) {
 *          // tell to the module that we consider a mobile device with at least 800px width
 *          responsivePopoverProvider.setMobileMediaQuery("(max-width: 800px)");
 *      });
 * </pre>
 */
angular.module("ovh-angular-responsive-popover").provider("responsivePopover", function () {
    "use strict";

    var self = this;
    var mobileMediaQuery = "(max-width: 980px)";

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /**
     *  @ngdoc method
     *  @name responsivePopover.responsivePopoverProvider#setMobileMediaQuery
     *  @methodOf responsivePopover.responsivePopoverProvider
     *
     *  @description
     *  Allows you to determine what app will consider as a mobile for responsive popover display.
     *
     *  @param {String} query The matchMedia query that will be used to detect mobile.
     *
     *  @return {String} The new query provided.
     */
    self.setMobileMediaQuery = function (query) {
        if (query) {
            mobileMediaQuery = query;
        }

        return mobileMediaQuery;
    };

    /* -----  End of CONFIGURATION  ------*/

    /**
     *  @ngdoc service
     *  @name responsivePopover.service:responsivePopover
     *
     *  @description
     *  This service enable you to get configured values.
     */
    self.$get = function () {
        return {
            /**
             *  @ngdoc method
             *  @name responsivePopover.service:responsivePopover#getMobileMediaQuery
             *  @methodOf responsivePopover.service:responsivePopover
             *
             *  @description
             *  Get the current configured media query. It is used to detect the popover display (simple popover or full screen popover for mobile).
             *
             *  @return {String} The configured mediaQuery.
             */
            getMobileMediaQuery: function () {
                return mobileMediaQuery;
            }
        };
    };

});

angular.module('responsivePopover').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-responsive-popover-popup/ovh-angular-responsive-popover-popup.html',
    "<div class=\"popover responsive-popover-popup responsive-popover responsive-popover-class\" data-tooltip-animation-class=fade data-uib-tooltip-classes data-ng-class=\"{ in: isOpen() }\"><div class=arrow></div><div class=popover-inner><h3 class=popover-title data-ng-bind=uibTitle data-ng-if=uibTitle></h3><div class=popover-content data-uib-tooltip-template-transclude=contentExp() data-tooltip-template-transclude-scope=originScope()></div></div></div>"
  );

}]);
