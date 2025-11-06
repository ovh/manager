import controller from './dedicatedCloud-datacenter-zerto-summary-delete.controller';
import template from './dedicatedCloud-datacenter-zerto-summary-delete.html';

export default {
  bindings: {
    zertoInformations: '<',
    goBack: '<',
    goBackToDashboard: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoDelete',
  template,
};
