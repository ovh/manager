import controller from './logs-list.controller';
import template from './logs-list.html';

export default {
  bindings: {
    orderLink: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
