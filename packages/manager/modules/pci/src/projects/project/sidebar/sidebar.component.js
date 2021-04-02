import template from './sidebar.html';
import controller from './sidebar.controller';

export default {
  bindings: {
    isOpen: '<',
    user: '<',
    onClick: '&',
  },
  controller,
  template,
};
