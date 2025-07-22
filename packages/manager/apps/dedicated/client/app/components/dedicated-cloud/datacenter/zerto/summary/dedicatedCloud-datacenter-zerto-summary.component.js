import controller from './dedicatedCloud-datacenter-zerto-summary.controller';
import template from './dedicatedCloud-datacenter-zerto-summary.html';

export default {
  bindings: {
    currentZerto: '<',
    currentUser: '<',
    goToDeleteSiteZertoModal: '<',
    goBackToListing: '<',
    pccType: '<',
    site: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoSummarySite',
  template,
};
