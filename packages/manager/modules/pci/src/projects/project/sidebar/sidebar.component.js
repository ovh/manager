import template from './sidebar.html';
import controller from './sidebar.controller';

export default {
  bindings: {
    isTrustedZone: '<',
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
    onCreateProjectClick: '<',
    isOpen: '<',
    onClick: '&',
  },
  controller,
  template,
};
