import controller from './logs-dashboards.controller';
import template from './logs-dashboards.html';

export default {
  bindings: {
    service: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
