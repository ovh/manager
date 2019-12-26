import controller from './delete-secondary-dns.controller';
import template from './delete-secondary-dns.html';

export default {
  bindings: {
    goBackToSecondaryDns: '<',
    serviceName: '<',
  },
  controller,
  template,
};
