import controller from './options.controller';
import template from './options.html';

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
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
