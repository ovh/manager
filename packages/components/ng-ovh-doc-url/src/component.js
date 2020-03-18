import controller from './controller';
import template from './template.html';

export default {
  template,
  bindings: {
    docId: '@',
  },
  transclude: true,
  controller,
};
