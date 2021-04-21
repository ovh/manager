import controller from './user-licences.controller';
import template from './user-licences.html';

const component = {
  bindings: {
    goToAddAddon: '<',
    goToDeleteUser: '<',
    goToInviteUser: '<',
    project: '<',
    projectId: '<',
    userList: '<',
    user: '<',
  },
  controller,
  template,
};

export default component;
