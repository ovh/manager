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
    goToStartApp: '<',
    goToStopApp: '<',
    goToDeleteApp: '<',
    goToGenerateToken: '<',
    goToUpdateAppImage: '<',
    goToUpdateScaling: '<',
    preset: '<',
  },
  controller,
  template,
};
