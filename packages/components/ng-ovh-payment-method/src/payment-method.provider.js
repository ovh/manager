import OvhPaymentMethodService from './payment-method.service';

export default class OvhPaymentMethodProvider {
  setPaymentMethodPageUrl(pageUrl) {
    this.paymentMethodPageUrl = pageUrl;
  }

  setUserLocale(userLocale) {
    this.userLocale = userLocale;
  }

  /* @ngInject */
  $get($q) {
    return new OvhPaymentMethodService(
      $q,
      this.paymentMethodPageUrl,
      this.userLocale,
    );
  }
}
