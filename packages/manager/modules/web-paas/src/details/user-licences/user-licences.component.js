import controller from './user-licences.controller';
import template from './user-licences.html';

const component = {
  bindings: {
    deleteUser: '<',
    project: '<',
    projectId: '<',
    inviteUser: '<',
    userList: '<',
  },
  controller,
  template,
};

export default component;
