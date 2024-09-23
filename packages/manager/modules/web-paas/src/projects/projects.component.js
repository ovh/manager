import controller from './projects.controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    guideUrl: '<',
    goToChangeOffer: '<',
    goToUserLicences: '<',
    openPartnerConsole: '<',
    projects: '<',
    terminateProject: '<',
    goToDetails: '<',
    webPaasProjectsTablePrefix: '<',
  },
  controller,
  template,
};
