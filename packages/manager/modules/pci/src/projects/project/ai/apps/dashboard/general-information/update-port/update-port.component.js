import controller from './update-port.controller';
import template from './update-port.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    app: '<',
    goBack: '<',
    trackApps: '<',
    trackingPrefix: '<',
  },
};
