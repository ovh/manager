(function () {
  angular.module('managerApp').directive('functionParamaterHunting', () => ({
    require: 'ngModel',
    link(/* $scope, $elm, $attrs, $ctrl */) {
      return true;
    },
  }));
}());
