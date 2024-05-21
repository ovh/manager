import template from './softphone.html';
import controller from './softphone.controller';

export default {
  template,
  controller,
  bindings: {
    openAddDeviceModal: '<',
    currentTheme: '<',
    billingAccount: '<',
    serviceName: '<',
    themes: '<',
    storeLinks: '<',
    softphoneDevices: '<',
    goToDeleteDevice: '<',
  },
};
