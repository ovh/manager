import controller from './apps.controller';
import template from './apps.html';

export default {
  bindings: {
    projectId: '<',
    goToAddApp: '<',
    goToApp: '<',
    goToAttachData: '<',
    goToDeleteApp: '<',
    goToCreateToken: '<',
    isAuthorized: '<',
    reloadState: '<',
    guideUrl: '<',
    appLink: '<',
    apps: '<',
    startApp: '<',
    stopApp: '<',
    pollAppStatus: '<',
    stopPollingAppStatus: '<',
    trackApps: '<',
    trackClick: '<',
  },
  controller,
  template,
};
