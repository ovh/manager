import controller from './fork.controller';
import template from './fork.html';

export default {
  bindings: {
    engines: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    lab: '<',
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
