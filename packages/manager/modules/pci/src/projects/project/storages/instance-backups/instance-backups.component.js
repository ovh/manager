import controller from './instance-backups.controller';
import template from './instance-backups.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    addInstanceBackup: '<',
    backupId: '<',
    createInstance: '<',
    deleteInstanceBackup: '<',
    instanceBackups: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    onListParamChange: '<',
    projectId: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    instanceBackupsRegions: '<',
    goToRegion: '<',
  },
};
