import controller from './vmware-option.controller';
import template from './vmware-option.html';

export default {
  bindings: {
    currentZerto: '<',
    datacenterList: '<',
    deleteZerto: '<',
    disableVmwareOption: '<',
    zertoGlobalStatus: '<',
    goToZerto: '<',
    goToZertoDatacenterSelection: '<',
    goToVpnConfiguration: '<',
    isZertoActionPossible: '<',
    orderVmwareOption: '<',
    productId: '<',
    setMessage: '<',
  },
  name: 'ovhManagerPccDashboardVmwareOption',
  controller,
  template,
};
