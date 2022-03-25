import controller from './license.controller';
import template from './license.template.html';

export default {
  controller,
  template,
  bindings: {
    action: '<',
    serviceName: '<',
    goToDashboard: '<',
    trackClick: '<',
  },
};
