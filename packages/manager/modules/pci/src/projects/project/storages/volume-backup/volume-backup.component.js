import controller from './volume-backup.controller';
import template from './volume-backup.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    pciFeatureRedirect: '<',
    volumeBackups: '<',
    goBack: '<',
    goToAddVolumeBlockStorage: '<',
    reloadState: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
