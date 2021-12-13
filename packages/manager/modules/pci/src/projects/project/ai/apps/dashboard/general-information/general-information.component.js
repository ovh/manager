import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    app: '<',
    flavor: '<',
    flavors: '<',
    projectId: '<',
    trackApps: '<',
    startApp: '<',
    stopApp: '<',
    goToAttachData: '<',
    goToStopApp: '<',
    goToGenerateToken: '<',
    preset: '<',
  },
  controller,
  template,
};
