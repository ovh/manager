import template from './template.html';

export default {
  bindings: {
    currentActiveLink: '<',
    dashboardLink: '<',
    storage: '<',
    snapshotPoliciesLink: '<',
    volumesLink: '<',
    isSnapshotPoliciesAvailable: '<',
    trackClick: '<',
  },
  template,
};
