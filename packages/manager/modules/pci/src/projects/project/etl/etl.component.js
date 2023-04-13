import controller from './etl.controller';
import template from './etl.html';

export default {
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    currentActiveLink: '<',
    homeLink: '<',
    cliLink: '<',
    workflows: '<',
  },
  controller,
  template,
};
