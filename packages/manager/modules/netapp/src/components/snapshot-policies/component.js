import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    policies: '<',
    onDelete: '&',
    selected: '=?',
  },
  controller,
  template,
};
