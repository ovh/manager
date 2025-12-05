import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    accessPath: '<',
    currentActiveLink: '<',
    volumeDashboardLink: '<',
    volumeDashboardAclLink: '<',
    volumeDashboardSnapshotsLink: '<',
    volumeDashboardActivesNFSLink: '<',
    volumeCapacityInfos: '<',
    volume: '<',
    updateVolume: '<',
    goToVolumeDashboard: '<',
    goToEditVolumeSize: '<',
    goToEditVolumeReserveSpace: '<',
    volumeReserveSpacePercentage: '<',
    volumeUsages: '<',
  },
  controller,
  template,
};
