import controller from './logs-roles.controller';
import template from './logs-roles.html';

export default {
  bindings: {
    service: '<',
    legacyAccess: '<',
    trackClick: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
