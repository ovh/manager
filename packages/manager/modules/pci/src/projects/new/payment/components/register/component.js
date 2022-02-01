import template from './index.html';

export default {
  name: 'pciProjectNewPaymentRegister',
  template,
  bindings: {
    creditProvisioningPlan: '<',
    eligibility: '<',
    model: '<',
    registerablePaymentMethods: '<',
    globalLoading: '<',
  },
};
