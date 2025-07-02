import controller from './dedicatedCloud-datacenter-dashboard.controller';
import template from './dedicatedCloud-datacenter-dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    datacenter: '<',
    dedicatedCloud: '<',
    deleteDatacenter: '<',
    drpAvailability: '<',
    drpGlobalStatus: '<',
    editDetails: '<',
    goToVpnConfiguration: '<',
    pccType: '<',
    productId: '<',
    serviceName: '<',
    setMessage: '<',
    goToResizeNsxEdge: '<',
    goToDatacenterNetwork: '<',
    goToRelocateNsxtEdge: '<',
    hasMaximumNsx: '<',
    goToAddNsx: '<',
    isNsxEdgeAvailable: '<',
    isNsxEdgeRelocateAvailable: '<',
  },
  controller,
  template,
};
