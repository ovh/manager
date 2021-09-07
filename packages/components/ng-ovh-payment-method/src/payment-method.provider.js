import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  setUserLocale(userLocale) {
    this.userLocale = userLocale;
  }

  /* @ngInject */
  $get($q, coreConfig) {
    return new OvhPaymentMethodService(
      $q,
      coreConfig,
      this.paymentMethodPageUrl,
      this.userLocale,
    );
  }
}
