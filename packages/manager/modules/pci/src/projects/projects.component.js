import controller from './projects.controller';
import template from './projects.html';

export default {
  bindings: {
    billingUrl: '<',
    confirmDeletion: '<',
    goToProject: '<',
    goToProjects: '<',
    projects: '<',
    terminateProject: '<',
  },
  controller,
  template,
};
