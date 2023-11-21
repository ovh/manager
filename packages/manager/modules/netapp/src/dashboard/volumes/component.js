import template from './template.html';

export default {
  bindings: {
    volumes: '<',
    networkInformations: '<',
    goToCreateVolume: '<',
    goToVolumeDetails: '<',
    goToCreateSnapshot: '<',
    goToSnapshots: '<',
    goToAcls: '<',
    goToDeleteVolume: '<',
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
