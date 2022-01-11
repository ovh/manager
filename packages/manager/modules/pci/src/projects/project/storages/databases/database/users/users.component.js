import controller from './users.controller';
import template from './users.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    goToAddUser: '<',
    goToDeleteUser: '<',
    goToModifyPassword: '<',
    goToUserInformations: '<',
    goToShowKey: '<',
    goToShowCert: '<',
    users: '<',
    stopPollingUsersStatus: '<',
    stopPollingDatabaseStatus: '<',
  },
  controller,
  template,
};
