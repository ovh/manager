import controller from './myPolicies.controller';
import template from './myPolicies.template.html';

export default {
  bindings: {
    alert: '<',
    cursors: '<',
    identitiesCriteria: '<',
    resourcesCriteria: '<',
    actionsCriteria: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
