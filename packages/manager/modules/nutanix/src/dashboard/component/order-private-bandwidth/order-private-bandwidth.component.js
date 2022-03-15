import controller from './order-private-bandwidth.controller';
import template from './order-private-bandwidth.html';

export default {
  bindings: {
    cluster: '<',
    goBack: '<',
    hasDefaultPaymentMethod: '<',
    serviceId: '<',
    trackingPrefix: '<',
    user: '<',
    onError: '&',
  },
  controller,
  template,
};
