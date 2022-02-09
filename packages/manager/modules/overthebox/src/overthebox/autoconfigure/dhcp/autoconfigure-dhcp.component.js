import controller from './autoconfigure-dhcp.controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
