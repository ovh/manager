import controller from './legacy.controller';
import template from './legacy.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    deleteDrp: '<',
    disableVmwareOption: '<',
    drpGlobalStatus: '<',
    editDetails: '<',

    goToDrp: '<',
    goToDrpDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isDrpActionPossible: '<',
    onMlSubscribe: '<',
    onTerminate: '<',
    orderSecurityOption: '<',
    orderVmwareOption: '<',
    productId: '<',
    showMailingList: '<',
    setMessage: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardLegacy',
  template,
};
