import controller from './dedicatedCloud-drpDatacenterSelection.controller';
import template from './dedicatedCloud-drpDatacenterSelection.html';

export default {
  template,
  controller,
  bindings: {
    currentDrp: '<',
    datacenterList: '<',
    goToDrpConfiguration: '<',
    goToPccDashboard: '<',
  },
  name: 'dedicatedCloudDrpDatacenterSelection',
};
