import controller from './commitment-pricing-mode.controller';
import template from './commitment-pricing-mode.html';

export default {
  bindings: {
    isHideableDiscount: '<',
    pricingMode: '=',
    pricingModes: '<',
    duration: '<',
  },
  controller,
  template,
};
