import controller from './logs-osd.controller';
import template from './logs-osd.html';

export default {
  bindings: {
    service: '<',
  },
  controller,
  controllerAs: 'ctrl',
  template,
};
