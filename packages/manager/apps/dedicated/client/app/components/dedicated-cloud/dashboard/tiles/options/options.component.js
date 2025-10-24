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
    zertoMultiSites: '<',
    goToDatacenter: '<',
    goToZerto: '<',
    goToZertoDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isZertoActionPossible: '<',
    isZertoTypeOnPremise: '<',
    isLogsDisabled: '<?',

    onBasicOptionsUpgrade: '&',
    onCertificationUpgrade: '&',
    onConfigurationOnlyUpgrade: '&',
  },
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
