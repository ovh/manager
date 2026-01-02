import template from './order-product.html';
import controller from './order-product.controller';

export default {
  controller,
  template,
  bindings: {
    billingAccountId: '<',
  },
};
