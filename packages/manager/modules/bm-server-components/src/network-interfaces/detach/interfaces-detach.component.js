import controller from './interfaces-detach.controller';
import template from './interfaces-detach.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    alertError: '<',
    interface: '<',
  },
};
