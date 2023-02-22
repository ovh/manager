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
    volumeDetached: '<',
    instanceDetached: '<',
    startPolling: '<',
    stopPolling: '<',
    goBack: '<',
    goToCreateVolumeBackup: '<',
    goToVolumeBlockStorage: '<',
    goToSnapshots: '<',
    reloadState: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
