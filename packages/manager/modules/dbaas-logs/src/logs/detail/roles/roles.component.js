import controller from './logs-roles.controller';
import template from './logs-roles.html';

export default {
  bindings: {
    service: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
