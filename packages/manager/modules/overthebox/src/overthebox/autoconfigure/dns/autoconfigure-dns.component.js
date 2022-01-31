import controller from './autoconfigure-dns.controller';
import template from './template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};
