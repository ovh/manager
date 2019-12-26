import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  /* @ngInject */
  $get($log, $q, $translate, $window, coreConfig, OvhApiMe) {
    return new OvhPaymentMethodService(
      $log,
      $q,
      $translate,
      $window,
      coreConfig,
      OvhApiMe,
      this.paymentMethodPageUrl,
    );
  }
}
