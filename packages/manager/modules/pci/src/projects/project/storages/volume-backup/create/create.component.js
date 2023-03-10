import controller from './create.controller';
import template from './create.template.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    guides: '<',
    volumes: '<',
    volumeBackupModel: '<',
    goToDetachVolume: '<',
    goToVolumeBackups: '<',
    knowMoreAboutBackupLink: '<',
    volumeBlockStorageLink: '<',
    volumeSnapshotStorageLink: '<',
    createBlockStorageVolumeLink: '<',
    goToSnapshots: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
