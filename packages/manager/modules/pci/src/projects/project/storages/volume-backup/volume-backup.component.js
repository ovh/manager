import controller from './volume-backup.controller';
import template from './volume-backup.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    pciFeatureRedirect: '<',
    catalogEndpoint: '<',
    volumeBackups: '<',
    guides: '<',
    volumeDetached: '<',
    instanceDetached: '<',
    startPolling: '<',
    stopPolling: '<',
    buildTaskResponse: '<',
    goBack: '<',
    goToCreateVolumeBackup: '<',
    goToVolumeBlockStorage: '<',
    goToSnapshots: '<',
    reloadState: '<',
    messageContainer: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
