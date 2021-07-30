import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentActiveLink: '<',
    dashboardLink: '<',
    storage: '<',
    createVolumeLink: '<',
    volumesLink: '<',
    isCommitmentAvailable: '<',
    isCreateVolumeAvailable: '<',
  },
  controller,
  template,
};
