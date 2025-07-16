import controller from './legacy.controller';
import template from './legacy.html';

export default {
  bindings: {
    currentZerto: '<',
    currentService: '<',
    currentUser: '<',
    datacenterList: '<',
    deleteZerto: '<',
    disableVmwareOption: '<',
    zertoGlobalStatus: '<',
    editDetails: '<',

    goToZerto: '<',
    goToZertoDatacenterSelection: '<',
    goToVpnConfiguration: '<',

    isZertoActionPossible: '<',
    onMlSubscribe: '<',
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
