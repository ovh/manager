import controller from './platform-sh.controller';
import template from './template.html';

export default {
  bindings: {
    createProject: '<',
    projects: '<',
    viewDetails: '<',
    openPartnerConsole: '<',
    terminateProject: '<',
  },
  controller,
  template,
};
