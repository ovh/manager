import controller from './list.controller';
import template from './list.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    volumeBackups: '<',
    volumeLink: '<',
    guides: '<',
    goToRestoreVolume: '<',
    goToCreateVolume: '<',
    goToDeleteVolume: '<',
    goBack: '<',
    goToAddVolumeBlockStorage: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
