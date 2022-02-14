import controller from './connector-transform-input.controller';
import template from './connector-transform-input.html';
import './connector-transform-input.scss';

export default {
  bindings: {
    data: '<',
    model: '=',
  },
  controller,
  template,
};
