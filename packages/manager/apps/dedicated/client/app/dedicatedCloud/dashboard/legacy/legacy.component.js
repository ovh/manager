import controller from './legacy.controller';
import template from './legacy.html';

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
    showMailingList: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardLegacy',
  template,
};
