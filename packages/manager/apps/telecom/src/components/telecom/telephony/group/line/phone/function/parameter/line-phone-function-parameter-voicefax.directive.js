(function () {
  angular.module('managerApp').directive('functionParamaterVoicefax', () => ({
    require: 'ngModel',
    link(/* $scope, $elm, $attrs, $ctrl */) {
      return true;
    },
  }));
}());
