import controller from './hosting-cdn-order.controller';
import template from './hosting-cdn-order.html';

export default {
  controller,
  template,
  bindings: {
    availablePlans: '<',
    goBack: '<',
    hasCDN: '<',
    cdnCase: '<',
    isOptionFree: '<',
    isV1CDN: '<',
    serviceOption: '<',
    planToPreselect: '<',

    onError: '<',
    onSuccess: '<',
    pricingType: '<',
    workflowType: '<',
    workflowOptions: '<',
  },
};
