import controller from './ovhPolicies.controller';
import template from './ovhPolicies.template.html';

export default {
  bindings: {
    alert: '<',
    cursors: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
