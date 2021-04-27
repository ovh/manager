import controller from './delete-user.controller';
import template from './delete-user.html';

const component = {
  bindings: {
    projectId: '<',
    customer: '<',
    goBack: '<',
  },
  controller,
  template,
};

export default component;
