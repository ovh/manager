import controller from './dedicatedCloud-datacenter-drp-listing.controller';
import template from './dedicatedCloud-datacenter-drp-listing.html';

export default {
  bindings: {
    goBackToDashboard: '<',
    datacenterId: '<',
    serviceName: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpListing',
  template,
};
