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
    goToCreateVolumeBackup: '<',
    goToDeleteVolumeBackup: '<',
    goBack: '<',
    goToAddVolumeBlockStorage: '<',
    volumeBlockStorageLink: '<',
    messageContainer: '<',
    onDocumentationClick: '<',
    trackClick: '<',
  },
};
