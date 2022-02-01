import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentChoose',
  controller,
  template,
  bindings: {
    creditProvisioningPlan: '<',
    validPaymentMethods: '<',
    registerablePaymentMethods: '<',
    eligibility: '<',
    globalLoading: '<',
    model: '<',
  },
};
