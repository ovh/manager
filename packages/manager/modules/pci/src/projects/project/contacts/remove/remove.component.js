import controller from './remove.controller';
import template from './remove.html';

const component = {
  bindings: {
    contactId: '<',
    goToContactsPage: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
