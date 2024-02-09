import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentCredit',
  controller,
  template,
  bindings: {
    cart: '<',
    amount: '<',
    getCancelHref: '<',
    globalLoading: '<',
    onCartFinalized: '<',
    trackProjectCreationError: '<',
    viewOptions: '<',
  },
};
