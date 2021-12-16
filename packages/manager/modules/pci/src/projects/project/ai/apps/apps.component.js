import controller from './apps.controller';
import template from './apps.html';

export default {
  bindings: {
    projectId: '<',
    goToAddApp: '<',
    goToApp: '<',
    goToAttachData: '<',
    goToStartApp: '<',
    goToStopApp: '<',
    goToDeleteApp: '<',
    goToCreateToken: '<',
    isAuthorized: '<',
    reloadState: '<',
    guideUrl: '<',
    appLink: '<',
    apps: '<',
    pollAppStatus: '<',
    stopPollingAppStatus: '<',
    trackApps: '<',
    trackClick: '<',
  },
  controller,
  template,
};
