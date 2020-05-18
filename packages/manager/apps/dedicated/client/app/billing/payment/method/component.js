import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethod',
  controller,
  template,
  bindings: {
    getActionHref: '<',
    guides: '<',
    paymentMethods: '<',
    user: '<',
  },
};
