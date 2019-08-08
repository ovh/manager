angular.module('App').controller('HostingDomainAttachModeOvhCtrl', ($scope) => {
  // Validator
  $scope.$watch('domainAttacheModeOvhForm.$valid', () => {
    $scope.model.step2Valid = $scope.domainAttacheModeOvhForm.$valid;
  });
});
