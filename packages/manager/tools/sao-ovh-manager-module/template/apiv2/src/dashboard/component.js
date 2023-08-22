import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    resourceId: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    resource: '<',
  },
  controller,
  template,
};
