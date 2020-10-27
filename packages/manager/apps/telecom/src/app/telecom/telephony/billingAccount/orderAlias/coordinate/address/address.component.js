import template from './address.html';
import controller from './address.controller';

export default {
  template,
  controller,
  bindings: {
    ngModel: '=?',
    regionCode: '@',
    ngDisabled: '=?',
  },
};
