import template from './hosting-cdn-order.html';

export default {
  template,
  bindings: {
    goBack: '<',
    user: '<',
    hasCDN: '<',
    cdnCase: '<',

    onError: '<',
    onSuccess: '<',
    pricingType: '<',
    workflowType: '<',
    workflowOptions: '<',
  },
};
