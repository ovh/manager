import controller from './contacts.controller';
import template from './contacts.html';

const component = {
  bindings: {
    addContact: '<',
    contacts: '<',
    deleteContact: '<',
    goToContactsPage: '<',
    projectId: '<',
    projectInfo: '<',
    user: '<',
  },
  template,
  controller,
};

export default component;
