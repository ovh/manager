import template from './dashboard.html';

export default {
  bindings: {
    app: '<',
    guideUrl: '<',
    reloadState: '<',
    needRefresh: '<',
    killTasks: '<',
    waitAppToStartOrStop: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    userAndRolesLink: '<',
    trackApps: '<',
  },
  template,
};
