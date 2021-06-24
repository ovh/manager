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
    meApiSchemas: '<',
    meEnums: '<',
    trackPage: '<',
    sendTrack: '<',
  },
  controller,
  template,
};
