import controller from './delete-app.controller';
import template from './delete-app.html';

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
