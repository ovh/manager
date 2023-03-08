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
    volumeBlockStorageLink: '<',
    volumeSnapshotStorageLink: '<',
    goToSnapshots: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
