import controller from './user-licences.controller';
import template from './user-licences.html';

const component = {
  bindings: {
    project: '<',
    projectId: '<',
    userList: '<',
  },
  controller,
  template,
};

export default component;
