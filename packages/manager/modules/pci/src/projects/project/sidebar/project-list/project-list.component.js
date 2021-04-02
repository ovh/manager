import controller from './project-list.controller';
import template from './project-list.html';

export default {
  bindings: {
    goToProject: '<',
    goToProjectInactive: '<',
  },
  controller,
  template,
};
