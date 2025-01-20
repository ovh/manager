import template from './softphone.html';
import controller from './softphone.controller';

export default {
  template,
  controller,
  bindings: {
    openAddDeviceModal: '<',
    deleteAllDevices: '<',
    currentTheme: '<',
    billingAccount: '<',
    serviceName: '<',
    themes: '<',
    storeLinks: '<',
    goToDeleteDevice: '<',
    softphoneStatus: '<',
  },
};
