import controller from './useracl.controller';
import template from './useracl.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    goToAddUserAcl: '<',
    goToDeleteUserAcl: '<',
    refreshUserAcl: '<',
    userAclList: '<',
    usersList: '<',
    goToManagerUsers: '<',
    setAclState: '<',
  },
  controller,
  template,
};
