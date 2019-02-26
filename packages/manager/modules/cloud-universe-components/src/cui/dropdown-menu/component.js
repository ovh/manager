import controller from './controller';
import template from './template.html';

export default {
  template,
  controller,
  transclude: {
    button: 'cuiDropdownMenuButton',
    body: 'cuiDropdownMenuBody',
  },
  bindings: {
    position: '<',
  },
};
