import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    accessPath: '<',
    currentActiveLink: '<',
    volumeDashboardLink: '<',
    volumeDashboardAclLink: '<',
    volumeDashboardSnapshotsLink: '<',
    volumeCapacityInfos: '<',
    volume: '<',
    updateVolume: '<',
    goToVolumeDashboard: '<',
    goToEditVolumeSize: '<',
    goToEditVolumeReserveSpace: '<',
    volumeReserveSpacePercentage: '<',
  },
  controller,
  template,
};
