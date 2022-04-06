import controller from './autoconfigure-firewall.controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
