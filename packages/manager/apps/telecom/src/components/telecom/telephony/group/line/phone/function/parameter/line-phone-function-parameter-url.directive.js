(function () {
  angular.module('managerApp').directive('functionParamaterUrl', () => ({
    require: 'ngModel',
    link(/* $scope, $elm, $attrs, $ctrl */) {
      return true;
    },
  }));
}());
