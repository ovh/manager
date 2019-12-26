import controller from './vps-password.controller';
import template from './vps-password.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
