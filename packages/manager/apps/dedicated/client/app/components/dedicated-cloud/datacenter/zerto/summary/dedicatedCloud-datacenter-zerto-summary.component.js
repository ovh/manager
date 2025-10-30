import controller from './dedicatedCloud-datacenter-zerto-summary.controller';
import template from './dedicatedCloud-datacenter-zerto-summary.html';

export default {
  bindings: {
    currentZerto: '<',
    currentUser: '<',
    goToDeleteSiteZertoModal: '<',
    zertoInformations: '<',
    goBackToListing: '<',
    pccType: '<',
    site: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoSummary',
  template,
};
