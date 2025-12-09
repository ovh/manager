import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    volumes: '<',
    goToCreateVolume: '<',
    goToVolumeDetails: '<',
    goToCreateSnapshot: '<',
    goToRestoreSnapshot: '<',
    goToSnapshots: '<',
    goToAcls: '<',
    goToDeleteVolume: '<',
    goToEditVolumeSize: '<',
    loadVolumeDetail: '<',
    storage: '<',
    isCreateVolumeAvailable: '<',
    canCreateVolume: '<',
    isCountAvailable: '<',
    canEditVolumes: '<',
    isDashboardAvailable: '<',
    trackClick: '<',
    goToEditVolumeReserveSpace: '<',
    totalVolumesStorage: '<',
    goToCreateReplications: '<',
    replicationsAvaibleServices: '<',
    isNetworkAvailable: '<',
  },
  template,
  controller,
};
