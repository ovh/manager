import template from './theme.html';
import controller from './theme.controller';
import './theme.css';

export default {
  template,
  controller,
  bindings: {
    color: '<',
    themeId: '<',
    selected: '=',
  },
};
