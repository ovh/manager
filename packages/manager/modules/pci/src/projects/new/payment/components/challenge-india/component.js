import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentChallengeIndia',
  controller,
  template,
  bindings: {
    model: '<',
    defaultPaymentMethod: '<',
    globalLoading: '<',
  },
};
