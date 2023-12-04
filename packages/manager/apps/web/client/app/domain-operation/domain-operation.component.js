import template from './domain-operation.html';
import controller from './domain-operation.controller';

export default {
  bindings: {
    domainOperationLink: '<',
    dnsOperationLink: '<',
    isDns: '<',
  },
  template,
  controller,
};
