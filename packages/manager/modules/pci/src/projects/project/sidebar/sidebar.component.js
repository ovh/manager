import template from './sidebar.html';
import controller from './sidebar.controller';

export default {
  bindings: {
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
    isOpen: '<',
    onClick: '&',
  },
  controller,
  template,
};
