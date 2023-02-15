import controller from './create.controller';
import template from './create.template.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    guides: '<',
    volumes: '<',
    goToDetachVolume: '<',
    goToVolumeBackups: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
