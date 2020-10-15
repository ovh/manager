import template from './coordinate.html';
import controller from './coordinate.controller';

export default {
  template,
  controller,
  bindings: {
    ngModel: '=?',
    ngDisabled: '=?',
    regionCode: '@',
    hideChoice: '=?',
  },
};
