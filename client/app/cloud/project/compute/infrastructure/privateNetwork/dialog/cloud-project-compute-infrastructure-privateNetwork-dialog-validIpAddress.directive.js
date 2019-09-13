angular.module('managerApp').directive('validIpAddress',
  CloudProjectComputeInfrastructurePrivateNetworkDialogService => ({
    require: 'ngModel',
    restrict: 'A',
    link(scope, elm, attrs, ngModel) {
      _.set(
        ngModel,
        '$validators.validIpAddress',
        value => CloudProjectComputeInfrastructurePrivateNetworkDialogService
          .constructor.isIPv4(value),
      );
    },
  }));
