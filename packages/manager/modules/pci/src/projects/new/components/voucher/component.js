import template from './index.html';
import controller from './controller';

export default {
  name: 'pciProjectNewVoucher',
  template,
  controller,
  bindings: {
    checkVoucherValidity: '<',
    deals: '<',
    eligibility: '<',
    model: '<',
    cart: '<',
    globalLoading: '<',
  },
};
