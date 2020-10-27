import template from './associate-device.html';
import controller from './associate-device.controller';

export default {
  template,
  controller,
  bindings: {
    billingAccount: '<',
    serviceName: '<',
    macAddress: '=',
  },
};
