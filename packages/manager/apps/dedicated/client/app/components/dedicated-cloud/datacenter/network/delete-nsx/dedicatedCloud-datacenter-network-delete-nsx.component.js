import controller from './dedicatedCloud-datacenter-network-delete-nsx.controller';
import template from './dedicatedCloud-datacenter-network-delete-nsx.html';

export default {
  bindings: {
    serviceName: '<',
    datacenterId: '<',
    nsxtEdgeId: '<',
    removeNsxtEdge: '<',
    handleSuccess: '<',
    handleError: '<',
    goBack: '<',
  },
  controller,
  template,
};
