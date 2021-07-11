import controller from './domain-dns-anycast.controller';
import template from './domain-dns-anycast.html';

export default {
  controller,
  template,
  bindings: {
    domainName: '<',
    goToDns: '<',
    goBack: '<',
    user: '<',
  },
};
