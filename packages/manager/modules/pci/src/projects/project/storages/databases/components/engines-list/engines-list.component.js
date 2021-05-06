import controller from './engines-list.controller';
import template from './engines-list.html';

export default {
  bindings: {
    engines: '<',
    selectedEngine: '=',
  },
  controller,
  template,
};
