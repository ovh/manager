import controller from './vps-terminate.controller';
import template from './vps-terminate.html';

export default {
  bindings: {
    cancel: '<',
    confirm: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerVpsTerminate',
  template,
};
