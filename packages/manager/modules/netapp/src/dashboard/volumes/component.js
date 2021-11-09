import template from './template.html';

export default {
  bindings: {
    volumes: '<',
    goToCreateVolume: '<',
    getVolumeDetailsHref: '<',
    goToCreateSnapshot: '<',
    goToSnapshots: '<',
    goToAcls: '<',
    getVolumeDeleteHref: '<',
    loadVolumeDetail: '<',
    storage: '<',
    isCreateVolumeAvailable: '<',
    canCreateVolume: '<',
    isCountAvailable: '<',
    canEditVolumes: '<',
    isDashboardAvailable: '<',
    trackClick: '<',
  },
  template,
};
