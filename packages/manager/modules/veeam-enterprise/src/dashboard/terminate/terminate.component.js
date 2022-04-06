import controller from './terminate.controller';
import template from './terminate.template.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    goToDashboard: '<',
    trackClick: '<',
  },
};
