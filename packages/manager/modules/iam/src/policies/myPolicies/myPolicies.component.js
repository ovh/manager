import controller from './myPolicies.controller';
import template from './myPolicies.template.html';

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
