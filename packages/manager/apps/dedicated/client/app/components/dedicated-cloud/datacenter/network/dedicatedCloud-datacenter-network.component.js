import controller from './dedicatedCloud-datacenter-network.controller';
import template from './dedicatedCloud-datacenter-network.html';

export default {
  bindings: {
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
  },
  controller,
  template,
};
