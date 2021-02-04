import controller from './web-paas.controller';
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
