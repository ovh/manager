import controller from './invite-user.controller';
import template from './invite-user.html';

const component = {
  bindings: {
    project: '<',
    projectId: '<',
    goBack: '<',
  },
  controller,
  template,
};

export default component;
