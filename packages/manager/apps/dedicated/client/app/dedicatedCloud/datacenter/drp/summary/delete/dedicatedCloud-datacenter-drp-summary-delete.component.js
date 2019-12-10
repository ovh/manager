import controller from './dedicatedCloud-datacenter-drp-summary-delete.controller';
import template from './dedicatedCloud-datacenter-drp-summary-delete.html';

export default {
  bindings: {
    drpInformations: '<',
    goBack: '<',
    goToPccDashboard: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpDelete',
  template,
};
