import controller from './dedicatedCloud-datacenter-network.controller';
import template from './dedicatedCloud-datacenter-network.html';

export default {
  bindings: {
    network: '<',
    serviceName: '<',
    datacenterId: '<',
    nsxtEdgeOptionServiceId: '<',
    goToRelocate: '<',
    goToResize: '<',
    hasMaximumNsx: '<',
    goToAddNsx: '<',
  },
  controller,
  template,
};
