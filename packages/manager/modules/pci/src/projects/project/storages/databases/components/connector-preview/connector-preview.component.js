import controller from './connector-preview.controller';
import template from './connector-preview.html';
import './connector-preview.scss';

export default {
  bindings: {
    data: '<',
    configuration: '<',
  },
  controller,
  template,
};
