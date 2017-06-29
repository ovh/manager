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
