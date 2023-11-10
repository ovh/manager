import controller from './show-secret.controller';
import template from './show-secret.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    user: '<',
    secretType: '<',
    trackDashboard: '<',
    secretKeyAndAccess: '<',
  },
  controller,
  template,
};

export default component;
