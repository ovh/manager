import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentChallenge',
  controller,
  template,
  bindings: {
    model: '<',
    defaultPaymentMethod: '<',
    globalLoading: '<',
  },
};
