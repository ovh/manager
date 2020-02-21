import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  /* @ngInject */
  $get($http, $log, $q, $translate, $window, coreConfig) {
    return new OvhPaymentMethodService(
      $http,
      $log,
      $q,
      $translate,
      $window,
      coreConfig,
      this.paymentMethodPageUrl,
    );
  }
}
