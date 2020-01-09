import template from './dedicatedCloud-dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    drpGlobalStatus: '<',
    goToDrp: '<',
    goToDrpDatacenterSelection: '<',
    goToVpnConfiguration: '<',
    isDrpActionPossible: '<',
  },
  name: 'ovhManagerPccDashboard',
  template,
};
