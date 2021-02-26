import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  setUserLocale(userLocale) {
    this.userLocale = userLocale;
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
      this.userLocale,
    );
  }
}
