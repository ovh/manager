import template from './commitment-pricing-mode.html';

export default {
  bindings: {
    pricingMode: '=',
    pricingModes: '<',
    upfrontSavings: '<',
    duration: '<',
  },
  template,
};
