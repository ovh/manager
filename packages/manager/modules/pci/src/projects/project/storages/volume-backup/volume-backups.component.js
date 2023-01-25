import controller from './volume-backups.controller';
import template from './volume-backups.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    pciFeatureRedirect: '<',
    volumeBackups: '<',
    volumeBackupDashboardLink: '<',
    goToAddVolumeBackup: '<',
    goToVolumeBackups: '<',
    goBack: '<',
    reloadState: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
