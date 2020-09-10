import controller from './vmware-option.controller';
import template from './vmware-option.html';

export default {
  bindings: {
    currentDrp: '<',
    datacenterList: '<',
    deleteDrp: '<',
    disableVmwareOption: '<',
    drpGlobalStatus: '<',
    goToDrp: '<',
    goToDrpDatacenterSelection: '<',
    goToVpnConfiguration: '<',
    isDrpActionPossible: '<',
    orderVmwareOption: '<',
    productId: '<',
    setMessage: '<',
  },
  name: 'ovhManagerPccDashboardVmwareOption',
  controller,
  template,
};
