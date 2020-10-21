import controller from './controller';
import template from './index.html';

export default {
  name: 'paymentMethodAddBillingContactView',
  bindings: {
    addSteps: '<',
    model: '<',
  },
  controller,
  template,
};
