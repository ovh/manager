import controller from './data-integration.controller';
import template from './data-integration.html';

export default {
  bindings: {
    projectId: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    cliLink: '<',
    workflows: '<',
  },
  controller,
  template,
};
