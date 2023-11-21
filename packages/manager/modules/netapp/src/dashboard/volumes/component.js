import template from './template.html';

export default {
  bindings: {
    volumes: '<',
    networkInformations: '<',
    goToCreateVolume: '<',
    getVolumeDetailsHref: '<',
    goToCreateSnapshot: '<',
    goToSnapshots: '<',
    goToAcls: '<',
    goToNetworkConfiguration: '<',
    getVolumeDeleteHref: '<',
    loadVolumeDetail: '<',
    storage: '<',
    isCreateVolumeAvailable: '<',
    canCreateVolume: '<',
    isCountAvailable: '<',
    canEditVolumes: '<',
    isDashboardAvailable: '<',
    trackClick: '<',
    totalVolumesStorage: '<',
  },
  template,
};
