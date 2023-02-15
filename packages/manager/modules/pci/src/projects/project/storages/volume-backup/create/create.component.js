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
    attachVolumeToInstanceLink: '<',
    goToDetachVolume: '<',
    goToVolumeBlockStorage: '<',
    goToSnapshots: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    trackClick: '<',
  },
};
