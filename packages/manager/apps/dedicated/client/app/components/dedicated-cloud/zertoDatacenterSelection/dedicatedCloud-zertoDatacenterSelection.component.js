import controller from './dedicatedCloud-zertoDatacenterSelection.controller';
import template from './dedicatedCloud-zertoDatacenterSelection.html';

export default {
  template,
  controller,
  bindings: {
    currentZerto: '<',
    datacenterList: '<',
    goToZerto: '<',
    goToPccDashboard: '<',
  },
  name: 'dedicatedCloudZertoDatacenterSelection',
};
