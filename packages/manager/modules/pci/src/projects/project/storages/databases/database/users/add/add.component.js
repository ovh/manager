import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    users: '<',
    roles: '<',
    trackDashboard: '<',
    isFeatureActivated: '<',
  },
  controller,
  template,
};
