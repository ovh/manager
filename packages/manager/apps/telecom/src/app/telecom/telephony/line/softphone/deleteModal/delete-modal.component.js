import template from './delete-modal.html';
import controller from './delete-modal.controller';

export default {
  template,
  controller,
  bindings: {
    billingAccount: '<',
    goBack: '<',
    deviceId: '<?',
    serviceName: '<',
    deleteAllDevices: '<',
  },
};
