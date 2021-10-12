import controller from './commitment-pricing-mode.controller';
import template from './commitment-pricing-mode.html';

export default {
  bindings: {
    pricingMode: '=',
    pricingModes: '<',
  },
  controller,
  template,
};
