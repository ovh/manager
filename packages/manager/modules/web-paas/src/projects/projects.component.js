import controller from './projects.controller';
import template from './template.html';

export default {
  bindings: {
    createProject: '<',
    projects: '<',
    viewDetails: '<',
    openPartnerConsole: '<',
    terminateProject: '<',
    guideUrl: '<',
  },
  controller,
  template,
};
