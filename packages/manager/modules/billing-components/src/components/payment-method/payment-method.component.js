import controller from './payment-method.controller';
import template from './payment-method.html';

export default {
  bindings: {
    trackingPage: '<',
    trackingCategory: '<',
  },
  controller,
  name: 'ovhManagerAutoRenewPaymentMethod',
  template,
};
