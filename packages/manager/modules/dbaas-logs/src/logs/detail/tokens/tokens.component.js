import controller from './logs-tokens.controller';
import template from './logs-tokens.html';

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
