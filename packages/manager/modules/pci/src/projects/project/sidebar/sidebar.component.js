import template from './sidebar.html';
import controller from './sidebar.controller';

export default {
  bindings: {
    isOpen: '<',
    onClick: '&',
  },
  controller,
  template,
};
