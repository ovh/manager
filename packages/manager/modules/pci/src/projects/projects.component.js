import controller from './projects.controller';
import template from './projects.html';

export default {
  bindings: {
    billingUrl: '@',
    confirmDeletion: '<',
    goToNewProject: '<',
    goToProject: '<',
    goToProjects: '<',
    isHdsAvailable: '<',
    isValidHdsSupportLevel: '<',
    projects: '<',
    terminateProject: '<',
    catalogEndpoint: '<',
    user: '<',
    isTrustedZone: '<',
    pciFeatures: '<',
    pciFeatureRedirect: '<',
    trackPage: '<',
    sendTrack: '<',
  },
  controller,
  template,
};
