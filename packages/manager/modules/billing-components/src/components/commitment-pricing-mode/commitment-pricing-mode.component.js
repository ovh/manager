import controller from './commitment-pricing-mode.controller';
import template from './commitment-pricing-mode.html';

export default {
  bindings: {
    isHideableDiscount: '<',
    pricingMode: '=',
    pricingModes: '<',
    duration: '<',
    hasDiscount: '<',
    upfrontSavings: '<',
    defaultPrice: '<',
    periodicTotalPrice: '<',
  },
  controller,
  template,
};
