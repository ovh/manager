import controller from './vps-option-terminate.controller';
import template from './vps-option-terminate.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    vpsOption: '<',
  },
  controller,
  template,
};
