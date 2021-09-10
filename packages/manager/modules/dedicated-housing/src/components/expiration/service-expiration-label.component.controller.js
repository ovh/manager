export default class ServiceExpirationLabelComponentCtrl {
  /* @ngInject */
  constructor($rootScope, $scope) {
    $scope.i18n = $rootScope.i18n;
  }

  $onInit() {
    if (!angular.isObject(this.serviceInfos)) {
      throw new Error('serviceExpirationLabel: Missing parameter(s)');
    }
  }

  isAutoRenew() {
    return this.serviceInfos.renew.automatic || this.serviceInfos.renew.forced;
  }
}
