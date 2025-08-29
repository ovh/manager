import controller from './dedicatedCloud-datacenter-add-nsx.controller';
import template from './dedicatedCloud-datacenter-add-nsx.html';

export default {
  bindings: {
    productId: '<',
    goBack: '<',
    serviceName: '<',
    datacenterId: '<',
    nsxEdgeCurrentLevel: '<',
    hasMaximumNsx: '<',
    addNsx: '<',
    handleSuccess: '<',
    handleError: '<',
    trackClick: '<',
  },
  controller,
  template,
};
