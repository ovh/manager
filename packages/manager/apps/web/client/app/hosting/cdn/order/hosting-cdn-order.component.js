import controller from './hosting-cdn-order.controller';
import template from './hosting-cdn-order.html';

export default {
  controller,
  template,
  bindings: {
    autoPayWithPreferredPaymentMethod: '<',
    isAutoPayable: '<',
    autoPayFreeOffer: '<',
    catalogAddons: '<',
    catalogAddon: '<',
    prepareCart: '<',
    checkoutCart: '<',
    goBack: '<',
    goBackWithError: '<',
    isOptionFree: '<',
    serviceName: '<',
    serviceOption: '<',
    user: '<',
    serviceInfo: '<',
    cdnProperties: '<',
    hasCDN: '<',
    isV1CDN: '<',
    isIncludedCDN: '<',
    isPayableCDN: '<',
    isV2CDN: '<',
    cdnCase: '<',
    trackClick: '<',
  },
};
