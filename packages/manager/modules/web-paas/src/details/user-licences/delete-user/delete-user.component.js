import controller from './delete-user.controller';
import template from './delete-user.html';

const component = {
  bindings: {
    customer: '<',
    goBack: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
