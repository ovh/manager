"use strict";

angular.module("ovh-angular-responsive-page-switcher", ["matchmedia-ng", "ngAnimate"]);

angular.module("ovh-angular-responsive-page-switcher").directive("responsiveSwitchPage", function () {

    "use strict";

    return {
        restrict: "A",
        require: "^responsiveSwitch",
        scope: true,
        transclude: true,
        replace: true,
        template: '<div class="responsive-switch-page">' +
                        '<div class="responsive-switch-page-wrapper" data-ng-if="active || (getResponsiveSwitchMode() === \'sidebyside\' && getResponsiveSwitchActivePage() === 1)">' +
                            '<div class="responsive-switch-page-content" data-ng-transclude></div>' +
                        "</div>" +
                    "</div>",

        //  '<div class="responsive-switch-page"' +
        //     ' data-ng-show="active || (getResponsiveSwitchMode() === \'sidebyside\' && getResponsiveSwitchActivePage() === 1)"' +
        //     // ' data-ng-class="setAnimationStyle()"' +
        //     ' data-ng-class="{' +
        //         ' \'moveToLeftFade\' : isMoveToLeft(),' +
        //         ' \'moveToRightFade\' : isMoveToRight(),' +
        //         ' \'moveFromLeftFade\' : isMoveFromLeft(),' +
        //         ' \'moveFromRightFade\' : isMoveFromRight(),' +
        //         ' \'page-on-foreground\' : isPageOnForeGround(),' +
        //         ' \'moveRightFromMiddle\' : isMoveRightFromMiddle()' +
        //     ' }"' +
        //     ' data-ng-transclude>' +
        // '</div>',
        compile: function () {

            return {
                pre: function ($scope) {

                    $scope.active = false;

                },
                post: function ($scope, $element, attr, switchPageCtrl) {

                    $scope.pageIndex = switchPageCtrl.addPage($scope);

                    $scope.isMoveToLeft = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "switch") {
                            return lastPageIndex <= $scope.pageIndex && switchPageCtrl.getActivePage() > $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.isMoveToRight = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "switch") {
                            return lastPageIndex >= $scope.pageIndex && switchPageCtrl.getActivePage() < $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.isMoveFromLeft = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "switch") {
                            return lastPageIndex > $scope.pageIndex && switchPageCtrl.getActivePage() === $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.isMoveFromRight = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "switch") {
                            return lastPageIndex < $scope.pageIndex && switchPageCtrl.getActivePage() === $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.isPageOnForeGround = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "sidebyside") {
                            return lastPageIndex === $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.isMoveRightFromMiddle = function () {
                        var lastPageIndex = switchPageCtrl.getLastActivePage();
                        if (lastPageIndex !== undefined && switchPageCtrl.getDisplayMode() === "sidebyside") {
                            return lastPageIndex < $scope.pageIndex && switchPageCtrl.getActivePage() === $scope.pageIndex;
                        }
                        return false;
                    };

                    $scope.getResponsiveSwitchMode = function () {
                        return switchPageCtrl.getDisplayMode();
                    };

                    $scope.getResponsiveSwitchActivePage = function () {
                        return switchPageCtrl.getActivePage();
                    };

                }
            };

        }
    };

});

angular.module("ovh-angular-responsive-page-switcher").controller("responsiveSwitchController", ["$scope", function ($scope) {

    "use strict";

    this.pages = [];

    var lastActivePage;

    this.addPage = function (page) {
        return this.pages.push(page) - 1;
    };

    this.setActivePage = function (pageIndex) {
        if (this.pages.length > pageIndex) {
            angular.forEach(this.pages, function (page, index) {
                // set all page to inactive
                if (page.active) {
                    page.active = false;
                    lastActivePage = index;
                }
            });
            this.pages[pageIndex].active = true;
        }
    };

    /**
     *  Responsivity
     */

    this.getTotalPageWidth = function () {
        return this.pages.length * $scope.pageWidth;
    };

    /**
     *  Utils
     */
    this.getLastActivePage = function () {
        return lastActivePage;
    };

    this.getDisplayMode = function () {
        return $scope.responsiveSwitchPageMode;
    };

    this.getActivePage = function () {
        return $scope.activePageIndex;
    };
}]);

angular.module("ovh-angular-responsive-page-switcher").directive("responsiveSwitch", ["$rootScope", "$timeout", "matchmedia", function ($rootScope, $timeout, matchmedia) {

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

}]);
