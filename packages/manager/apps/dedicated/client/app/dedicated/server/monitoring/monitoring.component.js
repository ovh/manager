import controller from './monitoring.controller';
import template from './monitoring.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
  },
  controller,
  template,
};
