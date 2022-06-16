import template from './dashboard.html';

export default {
  bindings: {
    app: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    reloadState: '<',
    needRefresh: '<',
    killTasks: '<',
    waitAppToStartOrStop: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    goToGenerateToken: '<',
    trackApps: '<',
  },
  template,
};
