import controller from './options.controller';
import template from './options.html';

export default {
  bindings: {
    currentZerto: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    deleteZerto: '<',
    zertoAvailability: '<',
    zertoGlobalStatus: '<',
    goToDatacenter: '<',
    goToZerto: '<',
    goToZertoDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isZertoActionPossible: '<',

    onBasicOptionsUpgrade: '&',
    onCertificationUpgrade: '&',
    onConfigurationOnlyUpgrade: '&',
  },
  controller,
  name: 'ovhManagerPccDashboardOptions',
  template,
};
