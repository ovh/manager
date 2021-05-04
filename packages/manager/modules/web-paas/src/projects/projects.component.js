import controller from './projects.controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    createProject: '<',
    projects: '<',
    viewDetails: '<',
    openPartnerConsole: '<',
    terminateProject: '<',
    guideUrl: '<',
    goToChangeRange: '<',
    goToUserLicences: '<',

  },
  controller,
  template,
};
