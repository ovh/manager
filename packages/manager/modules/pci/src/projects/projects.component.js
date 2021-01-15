import controller from './projects.controller';
import template from './projects.html';

export default {
  bindings: {
    confirmDeletion: '<',
    getProject: '<',
    goToProject: '<',
    goToProjects: '<',
    isHdsAvailable: '<',
    isValidHdsSupportLevel: '<',
    projects: '<',
    terminateProject: '<',
  },
  controller,
  template,
};
