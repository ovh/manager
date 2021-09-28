import controller from './restore.controller';
import template from './restore.html';

const component = {
  bindings: {
    backupInstance: '<',
    database: '<',
    goBack: '<',
    goBackToDashboard: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};

export default component;
