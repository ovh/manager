import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    roles: '<',
    trackDashboard: '<',
    isFeatureActivated: '<',
    permissionsList: '<',
    usersList: '<',
  },
  controller,
  template,
};
