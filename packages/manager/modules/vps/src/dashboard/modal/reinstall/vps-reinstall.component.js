import controller from './vps-reinstall.controller';
import template from './vps-reinstall.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
