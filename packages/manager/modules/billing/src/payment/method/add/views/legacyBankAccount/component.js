import controller from './controller';
import template from './index.html';

export default {
  name: 'paymentMethodAddLegacyBankAccountView',
  bindings: {
    model: '<',
  },
  controller,
  template,
};
