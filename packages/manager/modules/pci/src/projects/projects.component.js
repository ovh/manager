import controller from './projects.controller';
import template from './projects.html';

export default {
  bindings: {
    billingUrl: '@',
    redirectContext: '<',
    redirectCategory: '<',
    redirectTarget: '<',
    isRedirectRequired: '<',
    getTargetedState: '<',
    confirmDeletion: '<',
    goToNewProject: '<',
    goToState: '<',
    goToProject: '<',
    goToProjects: '<',
    isHdsAvailable: '<',
    isValidHdsSupportLevel: '<',
    projects: '<',
    activeProjects: '<',
    terminateProject: '<',
    catalogEndpoint: '<',
    user: '<',
    isTrustedZone: '<',
    pciFeatures: '<',
    pciFeatureRedirect: '<',
    trackPage: '<',
    sendTrack: '<',
    trackClick: '<',
    trackProjectCreationError: '<',
  },
  controller,
  template,
};
