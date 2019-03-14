import controller from './controller';
import template from './template.html';

export default {
  controller,
  bindings: {
    guides: '<',
  },
  transclude: true,
  template,
};
