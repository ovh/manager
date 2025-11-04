import controller from './dedicatedCloud-datacenter-dashboard.controller';
import template from './dedicatedCloud-datacenter-dashboard.html';

export default {
  bindings: {
    currentZerto: '<',
    currentUser: '<',
    datacenter: '<',
    dedicatedCloud: '<',
    deleteDatacenter: '<',
    zertoAvailability: '<',
    zertoGlobalStatus: '<',
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
    zertoMultiSites: '<',
    isZertoTypeOnPremise: '<',
  },
  controller,
  template,
};
