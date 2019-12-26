import controller from './vps-mount.controller';
import template from './vps-mount.html';

export default {
  bindings: {
    goBack: '<',
    mount: '<',
    restorePoint: '<',
    serviceName: '<',
  },
  controller,
  template,
};
