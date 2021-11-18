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
    user: '<',
    isTrustedZone: '<',
    pciFeatures: '<',
    trackPage: '<',
    sendTrack: '<',
  },
  controller,
  template,
};
