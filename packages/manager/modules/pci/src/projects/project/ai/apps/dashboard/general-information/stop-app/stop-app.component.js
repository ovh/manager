import controller from './stop-app.controller';
import template from './stop-app.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    goToApps: '<',
    app: '<',
    projectId: '<',
    trackApps: '<',
  },
};
