import controller from './activate.controller';
import template from './activate.html';

export default {
  bindings: {
    isTrustedZone: '<',
    projectId: '<',
    goToProjectDashboard: '<',
  },
  controller,
  template,
};
