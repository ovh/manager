import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentActiveLink: '<',
    dashboardLink: '<',
    storage: '<',
    goToCreateVolume: '<',
    snapshotPoliciesLink: '<',
    volumesLink: '<',
    isCommitmentAvailable: '<',
    isCreateVolumeAvailable: '<',
  },
  controller,
  template,
};
