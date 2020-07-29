import template from './index.html';

export default {
  name: 'pciProjectNewPaymentRegister',
  template,
  bindings: {
    eligibility: '<',
    model: '<',
    registerablePaymentMethods: '<',
    globalLoading: '<',
  },
};
