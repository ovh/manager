import controller from './attach-volume.controller';
import template from './attach-volume.template.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    volumeDetached: '<',
    instanceDetached: '<',
    messageContainer: '<',
    goBack: '<',
    goToVolumeBackups: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
