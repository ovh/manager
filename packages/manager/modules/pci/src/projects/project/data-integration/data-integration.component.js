import controller from './data-integration.controller';
import template from './data-integration.html';

import './style.scss';

export default {
  bindings: {
    projectId: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    sourcesLink: '<',
    destinationsLink: '<',
    cliLink: '<',
    workflows: '<',
  },
  controller,
  template,
};
