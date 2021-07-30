import template from './template.html';

export default {
  bindings: {
    volumes: '<',
    goToCreateVolume: '<',
    getVolumeDetailsHref: '<',
    getVolumeCreateSnapshotHref: '<',
    getVolumeSnapshotsHref: '<',
    getVolumeAclHref: '<',
    getVolumeDeleteHref: '<',
    loadVolumeDetail: '<',
    storage: '<',
    isCreateVolumeAvailable: '<',
  },
  template,
};
