import controller from './controller';
import template from './index.html';

export default {
  name: 'paymentMethodAddLegacyBillingAddressView',
  bindings: {
    currentUser: '<',
    model: '<',
  },
  controller,
  template,
};
