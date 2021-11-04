import template from './readonly-identity.html';
import controller from './readonly-identity.controller';

export default {
  template,
  controller,
  bindings: {
    ngModel: '=?',
    wallet: '<',
    countryEnum: '<',
  },
};
