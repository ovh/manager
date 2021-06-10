import controller from './invite-user.controller';
import template from './invite-user.html';

const component = {
  bindings: {
    goBack: '<',
    project: '<',
    projectId: '<',
    webPaasUserLicencesTrackingPrefix: '<',
  },
  controller,
  template,
};

export default component;
