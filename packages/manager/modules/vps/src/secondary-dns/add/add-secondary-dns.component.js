import controller from './add-secondary-dns.controller';
import template from './add-secondary-dns.html';

export default {
  bindings: {
    goBackToSecondaryDns: '<',
    serviceName: '<',
  },
  controller,
  template,
};
