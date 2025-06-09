import controller from './options.controller';
import template from './options.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    onDeactivateLogs: '<',
    deleteDrp: '<',
    drpAvailability: '<',
    drpGlobalStatus: '<',
    goToDatacenter: '<',
    goToDrp: '<',
    goToDrpDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isDrpActionPossible: '<',

    onBasicOptionsUpgrade: '&',
    onCertificationUpgrade: '&',
    onConfigurationOnlyUpgrade: '&',
  },
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
