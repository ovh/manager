import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    storage: '<',
    isNetworkAvailable: '<',
    goToNetworkConfiguration: '<',
    goToDeleteNetworkConfiguration: '<',
    networkInformations: '<',
    goToCreateVolume: '<',
    isCommitmentAvailable: '<',
    isCreateVolumeAvailable: '<',
    canManageSubscription: '<',
    canCreateVolume: '<',
    serviceInfos: '<',
    trackClick: '<',
  },
  controller,
  template,
};
