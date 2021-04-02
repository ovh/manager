import template from './sidebar.html';
import controller from './sidebar.controller';

export default {
  bindings: {
    goToProject: '<',
    goToProjectInactive: '<',
    isOpen: '<',
    user: '<',
    onClick: '&',
  },
  controller,
  template,
};
