import controller from './logs-aliases-home.controller';
import template from './logs-aliases-home.html';

export default {
  bindings: {
    service: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
