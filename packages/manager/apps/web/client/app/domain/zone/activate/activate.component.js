import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    autoPayWithPreferredPaymentMethod: '<',
    goBack: '<',
    serviceName: '<',
    serviceOption: '<',
    user: '<',
  },
  controller,
  template,
};
