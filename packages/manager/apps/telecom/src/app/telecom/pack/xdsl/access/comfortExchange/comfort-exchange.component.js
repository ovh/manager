import controller from './comfort-exchange.controller';
import template from './comfort-exchange.html';

export default {
  bindings: {
    xdslId: '<',
    openedRMAs: '<',
    packName: '<',
  },
  controller,
  template,
};
