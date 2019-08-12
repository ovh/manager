import controller from './controller';
import template from './index.html';

export default {
  name: 'ovhPaymentMethodRegister',
  controller,
  template,
  bindings: {
    paymentMethodType: '<',
    onInit: '&?',
  },
};
