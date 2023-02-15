import controller from './detach-volume.controller';
import template from './detach-volume.template.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    volume: '<',
    instance: '<',
    messageContainer: '<',
    goToCreateVolumeBackup: '<',
    goBack: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
