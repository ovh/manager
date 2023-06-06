import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
  },
  controller,
  template,
};
