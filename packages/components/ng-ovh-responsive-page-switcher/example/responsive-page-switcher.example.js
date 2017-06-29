'use strict';

angular.module('ovh-angular-responsive-page-switcher-test', [
    'ovh-angular-responsive-page-switcher',
    'responsive-popover'
]).controller('mainController', function () {

    this.open = false;

}).controller('contentController', function ($scope) {
    var self = this;

    this.activePage = 0;

    this.switchPage;

    $scope.$on('responsive.switch.created', function (evt, switchPage) {
        self.switchPage = switchPage;
    });
});
