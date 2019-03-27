import set from 'lodash/set';

export default /* @ngInject */ CloudProjectComputeInfrastructurePrivateNetworkDialogService => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, elm, attrs, ngModel) {
    set(
      ngModel,
      '$validators.validIpAddress',
      value => CloudProjectComputeInfrastructurePrivateNetworkDialogService
        .constructor.isIPv4(value),
    );
  },
});
