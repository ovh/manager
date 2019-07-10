angular
  .module('App')
  .controller('HostingDomainAttachModeExternalCtrl', ($scope) => {
    // Validator
    $scope.$watch('domainAttacheModeExternalForm.$valid', () => {
      $scope.model.step2Valid = $scope.domainAttacheModeExternalForm.$valid;
    });
  });
