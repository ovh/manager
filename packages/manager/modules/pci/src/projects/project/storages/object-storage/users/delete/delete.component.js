import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    credentials: '<',
    userId: '<',
    user: '<',
    projectId: '<',
    goToUsers: '<',
  },
  controller,
  template,
};

export default component;
