import controller from './dedicatedCloud-datacenter-dashboard.controller';
import template from './dedicatedCloud-datacenter-dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    datacenter: '<',
    dedicatedCloud: '<',
    deleteDatacenter: '<',
    drpGlobalStatus: '<',
    editDetails: '<',
    goToVpnConfiguration: '<',
    goToDrp: '<',
    goToDrpSummary: '<',
    goToDeleteDrp: '<',
    isDrpActionPossible: '<',
    pccType: '<',
    productId: '<',
    serviceName: '<',
    setMessage: '<',
  },
  controller,
  template,
};
