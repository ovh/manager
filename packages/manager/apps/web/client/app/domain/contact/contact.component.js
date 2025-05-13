import controller from './contact.controller';
import template from './contact.html';

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
