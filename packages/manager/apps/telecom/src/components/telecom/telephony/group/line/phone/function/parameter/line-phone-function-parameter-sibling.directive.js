(function () {
  angular.module('managerApp').directive('functionParamaterSibling', () => ({
    require: 'ngModel',
    link(/* $scope, $elm, $attrs, $ctrl */) {
      return true;
    },
  }));
}());
