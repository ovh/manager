import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentRegister',
  controller,
  template,
  bindings: {
    eligibility: '<',
    model: '<',
    registerablePaymentMethods: '<',
    globalLoading: '<',
  },
};
