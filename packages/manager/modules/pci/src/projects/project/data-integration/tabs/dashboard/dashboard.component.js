import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    workflows: '<',
    cliLink: '<',
  },
};
