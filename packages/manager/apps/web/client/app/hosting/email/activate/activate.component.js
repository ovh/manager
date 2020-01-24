import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    serviceName: '<',
    user: '<',
    domainNames: '<',
    goToHosting: '<',
  },
  controller,
  template,
};
