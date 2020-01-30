import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentCreditType',
  controller,
  template,
  bindings: {
    eligibility: '<',
    model: '<',
    globalLoading: '<',
  },
};
