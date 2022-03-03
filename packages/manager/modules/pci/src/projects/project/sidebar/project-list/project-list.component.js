import controller from './project-list.controller';
import template from './project-list.html';

export default {
  bindings: {
    isTrustedZone: '<',
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
  },
  controller,
  template,
};
