import controller from './myPolicies.controller';
import template from './myPolicies.template.html';

export default {
  bindings: {
    alert: '<',
    cursors: '<',
    identitiesFilter: '<',
    resourcesFilter: '<',
    actionsFilter: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
