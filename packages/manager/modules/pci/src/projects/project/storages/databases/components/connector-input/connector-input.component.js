import controller from './connector-input.controller';
import template from './connector-input.html';

export default {
  bindings: {
    data: '<',
    configuration: '<',
    model: '=',
  },
  controller,
  template,
};
