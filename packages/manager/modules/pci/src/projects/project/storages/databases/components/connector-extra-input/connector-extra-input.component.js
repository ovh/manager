import controller from './connector-extra-input.controller';
import template from './connector-extra-input.html';

export default {
  bindings: {
    model: '=',
    configuration: '<',
    data: '<',
  },
  controller,
  template,
};
