import controller from './dedicatedCloud-datacenter-drp-listing.controller';
import template from './dedicatedCloud-datacenter-drp-listing.html';

export default {
  bindings: {
    goBackToDashboard: '<',
    openDeleteSiteModal: '<',
    zertoMultiSites: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpListing',
  template,
};
