import template from './template.html';
import controller from './controller';

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
  controller,
};
