import controller from './restore.controller';
import template from './restore.html';

const component = {
  bindings: {
    database: '<',
    backupList: '<',
    restoreMode: '<',
    backupId: '<',
    goBack: '<',
    goToDatabase: '<',
    projectId: '<',
    trackDashboard: '<',
    user: '<',
    onDatabaseAdd: '<',
    engines: '<',
  },
  controller,
  template,
};

export default component;
