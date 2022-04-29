import controller from './fork.controller';
import template from './fork.html';

export default {
  bindings: {
    databaseGuideUrl: '<',
    engines: '<',
    guideUrl: '<',
    onDatabaseFork: '<',
    projectId: '<',
    privateNetworks: '<',
    trackDatabases: '<',
    user: '<',
    backupInstance: '<',
    database: '<',
  },
  controller,
  template,
};
