import controller from './traffic-cancel.controller';
import template from './traffic-cancel.template.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
  },
  controller,
  template,
};
