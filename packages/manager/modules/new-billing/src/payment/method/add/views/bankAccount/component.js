import controller from './controller';
import template from './index.html';

export default {
  name: 'paymentMethodAddBankAccountView',
  bindings: {
    model: '<',
  },
  controller,
  template,
};
