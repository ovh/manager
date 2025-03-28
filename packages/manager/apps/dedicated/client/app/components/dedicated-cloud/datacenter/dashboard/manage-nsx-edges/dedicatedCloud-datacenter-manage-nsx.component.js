import controller from './dedicatedCloud-datacenter-manage-nsx.controller';
import template from './dedicatedCloud-datacenter-manage-nsx.html';

export default {
  bindings: {
    productId: '<',
    goBack: '<',
    serviceName: '<',
    datacenterId: '<',
    setMessage: '<',
    nsxEdgeCurrentLevel: '<',
    nsxtEdgesScalingCapabilities: '<',
    datastoreOrderLink: '<',
    hostOrderLink: '<',
    trackClick: '<',
    trackPage: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
