import template from './template.html';

export default {
  template,
  bindings: {
    alertError: '<',
    cluster: '<',
    goBack: '<',
    hasDefaultPaymentMethod: '<',
    serviceId: '<',
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
    isOldCluster: '<',
  },
};
