import controller from './dedicatedCloud-datacenter-drp-summary.controller';
import template from './dedicatedCloud-datacenter-drp-summary.html';

export default {
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    goToDeleteDrpModal: '<',
    goToPccDashboard: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpSummary',
  template,
};
