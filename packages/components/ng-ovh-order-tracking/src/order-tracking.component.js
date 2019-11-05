import controller from './order-tracking.controller';
import template from './order-tracking.html';

export default {
  controller,
  template,
  bindings: {
    orderId: '<',
    billingUrl: '<',
    onBackButtonClick: '&',
  },
};
