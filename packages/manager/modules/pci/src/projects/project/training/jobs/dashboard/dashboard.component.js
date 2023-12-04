import template from './dashboard.html';
import controller from './dashboard.controller';

export default {
  controller,
  bindings: {
    job: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    // reloadState: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    logsLink: '<',
    goToUsersAndTokens: '<',
    // trackApps: '<',
  },
  template,
};
