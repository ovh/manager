angular.module("ovh-angular-responsive-page-switcher").directive("responsiveSwitch", function ($rootScope, $timeout, matchmedia) {

    "use strict";

    return {
        restrict: "A",
        controller: "responsiveSwitchController",
        scope: true,
        transclude: true,
        replace: true,
        template: '<div class="responsive-switch"' +
                        ' data-ng-class="{' +
                            " 'responsive-switch_mobile' : isMobile," +
                            " 'responsive-switch-sidebyside' : responsiveSwitchPageMode === 'sidebyside'," +
                            " 'responsive-switch-switch' : responsiveSwitchPageMode === 'switch'," +
                            " 'responsive-switch-expand' : responsiveSwitchPageMode === 'sidebyside' && activePageIndex >= 1" +
                        ' }"' +
                        " data-ng-transclude>" +
                    "</div>",
        link: function ($scope, $element, attr, ctrl) {

            $scope.attr = attr;
            $scope.isMobile = false;

            $scope.activePageIndex = attr.responsiveSwitchActivePageIndex ? parseInt(attr.responsiveSwitchActivePageIndex, 10) : 0;
            $scope.pageWidth = attr.responsiveSwitchPagesWidth ? parseInt(attr.responsiveSwitchPagesWidth, 10) : 0;

            var mobileMatchMedia = attr.responsiveSwitchMatchMedia || "(max-width: 980px)";
            var forcedMode = attr.responsiveSwitchForceMode;

            /**
             *  Responsivity
             */

            function calculateDisplayMode () {
                $scope.isMobile = matchmedia.is(mobileMatchMedia);
                var availableLeft = $element ? $element[0].getBoundingClientRect().left : 0;
                var availableWidth = $(window).innerWidth();

                if ($scope.isMobile) {
                    $scope.responsiveSwitchPageMode = "switch";
                } else if (forcedMode) {
                    $scope.responsiveSwitchPageMode = forcedMode;
                } else if (availableLeft + ctrl.getTotalPageWidth() < availableWidth) {
                    $scope.responsiveSwitchPageMode = "sidebyside";
                } else {
                    $scope.responsiveSwitchPageMode = "switch";
                }
            }

            /**
             *  INITIALIZATION
             */

            // GLOBAL INITIALIZATION
            function init () {
                initResizeWatcher();
                initActivePageIndexWatcher();

                $timeout(function () {
                    calculateDisplayMode();
                }, 99);

                // Expose some functions
                $rootScope.$broadcast("responsive.switch.created", {
                    getDisplayMode: function () { return $scope.responsiveSwitchPageMode; },
                    getActivePage: function () { return $scope.activePageIndex; }
                });
            }

            // WATCHER INITIALIZATION
            // ACTIVE PAGE INDEX WATCHER
            function initActivePageIndexWatcher () {
                $scope.$watch("attr.responsiveSwitchActivePageIndex", function (newIndex, oldIndex) {
                    $scope.activePageIndex = oldIndex !== undefined ? parseInt(newIndex, 10) : 0;
                    ctrl.setActivePage($scope.activePageIndex);
                });
            }

            // RESIZE WATCHER
            function initResizeWatcher () {
                var $wdw = $(window);
                var onWindowResize = _.debounce(function () {
                    calculateDisplayMode();
                    $scope.$apply();
                }, 99);

                $wdw.on("resize", onWindowResize);

                $scope.$on("$destroy", function () {
                    $wdw.off("resize", onWindowResize);
                });
            }

            init();

        }
    };

});
