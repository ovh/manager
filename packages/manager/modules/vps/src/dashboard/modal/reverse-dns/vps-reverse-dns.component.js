import controller from './vps-reverse-dns.controller';
import template from './vps-reverse-dns.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
