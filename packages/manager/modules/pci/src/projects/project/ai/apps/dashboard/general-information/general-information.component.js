import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    app: '<',
    flavor: '<',
    flavors: '<',
    projectId: '<',
    trackApps: '<',
    goToAttachData: '<',
    goToStopApp: '<',
    goToDeleteApp: '<',
    goToGenerateToken: '<',
    preset: '<',
  },
  controller,
  template,
};
