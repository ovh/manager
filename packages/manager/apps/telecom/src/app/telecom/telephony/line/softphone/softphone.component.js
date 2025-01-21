import template from './softphone.html';
import controller from './softphone.controller';

export default {
  template,
  controller,
  bindings: {
    currentTheme: '<',
    billingAccount: '<',
    serviceName: '<',
    themes: '<',
    storeLinks: '<',
    goToAddDevice: '<',
    goToDeleteDevice: '<',
    softphoneStatus: '<',
  },
};
