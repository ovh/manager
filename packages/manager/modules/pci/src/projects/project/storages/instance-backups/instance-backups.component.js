import controller from './instance-backups.controller';
import template from './instance-backups.html';

export default {
  controller,
  template,
  bindings: {
    addInstanceBackup: '<',
    backupId: '<',
    createInstance: '<',
    deleteInstanceBackup: '<',
    instanceBackups: '<',
    guideUrl: '<',
    onListParamChange: '<',
    projectId: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    instanceBackupsRegions: '<',
    goToRegion: '<',
  },
};
