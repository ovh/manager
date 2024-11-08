import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
  },
  controller,
  template,
  transclude: true,
};
