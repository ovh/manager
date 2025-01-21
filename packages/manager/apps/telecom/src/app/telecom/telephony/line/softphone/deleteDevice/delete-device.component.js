import template from './delete-device.html';
import controller from './delete-device.controller';

export default {
  template,
  controller,
  bindings: {
    billingAccount: '<',
    goBack: '<',
    deviceId: '<?',
    serviceName: '<',
  },
};
