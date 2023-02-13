import controller from './volume-backup.controller';
import template from './volume-backup.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    pciFeatureRedirect: '<',
    volumeBackups: '<',
    guides: '<',
    startPolling: '<',
    stopPolling: '<',
    goBack: '<',
    goToCreateVolumeBackup: '<',
    goToAddVolumeBlockStorage: '<',
    reloadState: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
