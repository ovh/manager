import controller from './dedicatedCloud-datacenter-network.controller';
import template from './dedicatedCloud-datacenter-network.html';

export default {
  bindings: {
    productId: '<',
    network: '<',
    serviceName: '<',
    datacenterId: '<',
    nsxtEdgeOptionServiceId: '<',
    goToRelocate: '<',
    goToRemove: '<',
    goToResize: '<',
    hasMaximumNsx: '<',
    hasOnlyMinimumNsx: '<',
    goToAddNsx: '<',
    isNsxEdgeRelocateAvailable: '<',
    trackClick: '<',
  },
  controller,
  template,
};
