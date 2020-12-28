import controller from './comfort-exchange.controller';
import template from './comfort-exchange.html';

export default {
  bindings: {
    xdslId: '<',
    openedRMAs: '<',
  },
  controller,
  template,
};
