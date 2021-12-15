import controller from './stop.controller';
import template from './stop.html';

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
