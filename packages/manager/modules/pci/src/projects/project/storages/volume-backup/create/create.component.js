import controller from './create.controller';
import template from './create.template.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    guides: '<',
    volumes: '<',
    volumesAddons: '<',
    volumeBackupModel: '<',
    goToDetachVolume: '<',
    goToVolumeBackups: '<',
    buildTaskResponse: '<',
    knowMoreAboutBackupLink: '<',
    volumeBlockStorageLink: '<',
    volumeSnapshotStorageLink: '<',
    createBlockStorageVolumeLink: '<',
    goToSnapshots: '<',
    messageContainer: '<',
    volumeBackupTrackPrefix: '<',
    onDocumentationClick: '<',
    trackClick: '<',
    trackPage: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
};
