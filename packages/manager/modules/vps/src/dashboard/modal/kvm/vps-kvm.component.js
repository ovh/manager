import controller from './vps-kvm.controller';
import template from './vps-kvm.html';

export default {
  bindings: {
    goBack: '<',
    noVnc: '<',
    serviceName: '<',
  },
  controller,
  template,
};
