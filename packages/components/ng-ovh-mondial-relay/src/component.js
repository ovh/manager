import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    ngModel: '=?',
    userService: '=?',
    mondialRelayService: '=?',
  },
  template,
  controller,
};
