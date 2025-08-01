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
    isPublicNetworkAvailable: '<',
    networkInformations: '<',
    trackClick: '<',
  },
  template,
  controller,
};
