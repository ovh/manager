import controller from './rma.controller';
import template from './rma.html';

export default {
  controller,
  template,
  bindings: {
    order: '<',
    returnSuccess: '<',
    rmas: '<',
  },
};
