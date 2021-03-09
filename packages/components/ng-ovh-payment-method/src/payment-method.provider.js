import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  setUserLocale(userLocale) {
    this.userLocale = userLocale;
  }

  setRegion(region) {
    this.region = region;
  }

  /* @ngInject */
  $get($log, $q, $translate, $window, OvhApiMe, ovhFeatureFlipping) {
    return new OvhPaymentMethodService(
      $log,
      $q,
      $translate,
      $window,
      OvhApiMe,
      ovhFeatureFlipping,
      this.paymentMethodPageUrl,
      this.region,
      this.userLocale,
    );
  }
}
