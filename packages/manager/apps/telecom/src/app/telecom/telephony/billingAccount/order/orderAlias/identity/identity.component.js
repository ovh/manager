import template from './identity.html';
import controller from './identity.controller';

export default {
  template,
  controller,
  bindings: {
    ngModel: '=?',
    ngDisabled: '=?',
    organisation: '@',
  },
};
