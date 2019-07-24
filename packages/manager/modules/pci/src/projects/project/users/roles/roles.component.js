import controller from './roles.controller';
import template from './roles.html';

export default {
  bindings: {
    confirmRoles: '<',
    goBack: '<',
    projectId: '<',
    rolesList: '<',
    userId: '<',
    userRoles: '<',
  },
  controller,
  template,
};
