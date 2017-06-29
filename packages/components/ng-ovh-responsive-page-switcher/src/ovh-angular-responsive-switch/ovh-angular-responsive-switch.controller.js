angular.module("ovh-angular-responsive-page-switcher").controller("responsiveSwitchController", function ($scope) {

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
});
