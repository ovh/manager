import controller from './vps-reboot.controller';
import template from './vps-reboot.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
