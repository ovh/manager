angular
  .module('App')
  .controller('HostingDomainAttachModeOvhCtrl', ($scope, coreURLBuilder) => {
    // Validator
    $scope.$watch('domainAttacheModeOvhForm.$valid', () => {
      $scope.model.step2Valid = $scope.domainAttacheModeOvhForm.$valid;
    });

    $scope.changeOfferLink = coreURLBuilder.buildURL(
      'web',
      '#/hosting/:serviceName/change-offer',
      { serviceName: $scope.model.hosting.serviceName },
    );
  });
