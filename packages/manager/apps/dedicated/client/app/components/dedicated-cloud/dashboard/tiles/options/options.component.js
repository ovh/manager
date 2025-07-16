import controller from './options.controller';
import template from './options.html';

export default {
  bindings: {
    currentZerto: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    onDeactivateLogs: '<',
    deleteZerto: '<',
    zertoAvailability: '<',
    zertoGlobalStatus: '<',
    goToDatacenter: '<',
    goToZerto: '<',
    goToZertoDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isZertoActionPossible: '<',
    isLogsDisabled: '<?',

    onBasicOptionsUpgrade: '&',
    onCertificationUpgrade: '&',
    onConfigurationOnlyUpgrade: '&',
  },
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
