import controller from './dedicatedCloud-datacenter-manage-nsx.controller';
import template from './dedicatedCloud-datacenter-manage-nsx.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    datacenterId: '<',
    setMessage: '<',
    nsxEdgeCurrentLevel: '<',
    nsxtEdgesScalingCapabilities: '<',
    datastoreOrderLink: '<',
    hostOrderLink: '<',
  },
  controller,
  template,
};
