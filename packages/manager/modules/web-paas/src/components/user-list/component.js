import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    deleteUser: '<',
    hideInvite: '<',
    inviteUser: '<',
    project: '<',
    projectId: '<',
    userList: '<',
  },
  controller,
  template,
};
