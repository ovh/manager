import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentCredit',
  controller,
  template,
  bindings: {
    eligibility: '<',
    model: '<',
    globalLoading: '<',
  },
};
