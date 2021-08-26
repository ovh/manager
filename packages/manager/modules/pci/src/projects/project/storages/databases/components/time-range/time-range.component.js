import controller from './time-range.controller';
import template from './time-range.html';
import './time-range.scss';

export default {
  bindings: {
    available: '<',
    selectedRange: '=',
  },
  controller,
  template,
};
