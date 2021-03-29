import controller from './hosting-cdn-order.controller';
import template from './hosting-cdn-order.html';

export default {
  controller,
  template,
  bindings: {
    availablePlans: '<',
    goBack: '<',
    user: '<',
    hasCDN: '<',
    cdnCase: '<',
    isOptionFree: '<',
    serviceOption: '<',

    onError: '<',
    onSuccess: '<',
    pricingType: '<',
    workflowType: '<',
    workflowOptions: '<',
  },
};
