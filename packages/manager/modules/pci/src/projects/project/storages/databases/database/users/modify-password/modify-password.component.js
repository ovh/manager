import controller from './modify-password.controller';
import template from './modify-password.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;
