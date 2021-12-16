import controller from './start.controller';
import template from './start.html';

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
