import controller from './private-order.controller';
import template from './private-order.html';

export default {
  bindings: {
    trackClick: '<',
    goBack: '<',
    hasDefaultPaymentMethod: '<',
    serverName: '<',
    serviceId: '<',
    specifications: '<',
    trackingPrefix: '<',
    user: '<',
    onError: '&?',
    onSuccess: '&?',
    isClusterNode: '<',
  },
  controller,
  template,
};
