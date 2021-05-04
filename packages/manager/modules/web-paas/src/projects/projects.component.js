import controller from './projects.controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    createProject: '<',
    guideUrl: '<',
    goToChangeRange: '<',
    goToUserLicences: '<',
    openPartnerConsole: '<',
    projects: '<',
    terminateProject: '<',
    viewDetails: '<',
  },
  controller,
  template,
};
