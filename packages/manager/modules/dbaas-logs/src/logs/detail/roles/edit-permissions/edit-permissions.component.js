import controller from './edit-permissions.controller';
import template from './edit-permissions.html';

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
