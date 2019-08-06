import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    goToContactsPage: '<',
    projectId: '<',
    user: '<',
  },
  template,
  controller,
};

export default component;
