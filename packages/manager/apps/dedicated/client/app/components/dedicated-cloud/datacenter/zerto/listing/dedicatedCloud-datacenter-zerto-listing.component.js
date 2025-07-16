import controller from './dedicatedCloud-datacenter-zerto-listing.controller';
import template from './dedicatedCloud-datacenter-zerto-listing.html';

export default {
  bindings: {
    goBackToDashboard: '<',
    openDeleteSiteModal: '<',
    zertoMultiSites: '<',
    goToAddSite: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoListing',
  template,
};
