import controller from './tags-input.controller';
import template from './tags-input.html';

export default {
  bindings: {
    model: '=',
    label: '@',
    buttonLabel: '@',
  },
  controller,
  template,
};
