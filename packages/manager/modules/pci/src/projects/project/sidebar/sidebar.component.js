import template from './sidebar.html';
import controller from './sidebar.controller';
import './sidebar.scss';

export default {
  bindings: {
    isOpen: '<',
    user: '<',
    onClick: '&',
  },
  controller,
  template,
};
