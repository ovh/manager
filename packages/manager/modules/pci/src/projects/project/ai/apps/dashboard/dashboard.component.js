import template from './dashboard.html';
import controller from './dashboard.controller';

export default {
  controller,
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
    goToUsersAndTokens: '<',
    trackApps: '<',
  },
  template,
};
