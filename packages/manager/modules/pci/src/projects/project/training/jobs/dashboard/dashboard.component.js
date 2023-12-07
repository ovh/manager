import template from './dashboard.html';

export default {
  bindings: {
    job: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    logsLink: '<',
    goToUsersAndTokens: '<',
  },
  template,
};
