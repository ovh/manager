import controller from './public-order.controller';
import template from './public-order.html';

export default {
  controller,
  template,
  bindings: {
    alertError: '<',
    atTrack: '<',
    goBack: '<',
    hasDefaultPaymentMethod: '<',
    serverName: '<',
    serviceId: '<',
    specifications: '<',
    trackingPrefix: '<',
    user: '<',
  },
};
