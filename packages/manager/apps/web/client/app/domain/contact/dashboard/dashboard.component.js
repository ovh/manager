import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  controller,
  template,
  bindings: {
    contactsManagementUrl: '<',
    goBack: '<',
    domain: '<',
    domainName: '<',
  },
};
