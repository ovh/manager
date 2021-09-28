import controller from './engines-list.controller';
import template from './engines-list.html';

export default {
  bindings: {
    disabled: '<',
    onChange: '&?',
    engines: '<',
    currentEngine: '<',
    selectedEngine: '=',
  },
  controller,
  template,
};
