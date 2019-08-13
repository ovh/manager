(function () {
  angular.module('managerApp').directive('functionParamaterNumber', () => ({
    require: 'ngModel',
    link(/* $scope, $elm, $attrs, $ctrl */) {
      return true;
    },
  }));
}());
