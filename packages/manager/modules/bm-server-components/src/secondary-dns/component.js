import controller from './secondary-dns.controller';
import template from './secondary-dns.template.html';

export default {
  bindings: {
    goToAddSecondaryDns: '<',
    goToDeleteSecondaryDns: '<',
    server: '<',
  },
  controller,
  template,
};
