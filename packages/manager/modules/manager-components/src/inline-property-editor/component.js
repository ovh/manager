import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    model: '=',
    property: '@',
    onSubmit: '&',
  },
  controller,
  template,
};
