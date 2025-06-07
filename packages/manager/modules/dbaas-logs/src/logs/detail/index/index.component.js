import controller from './logs-index.controller';
import template from './logs-index.html';

export default {
  bindings: {
    service: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
