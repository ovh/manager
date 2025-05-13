import template from './special-number-form.html';
import controller from './special-number-form.controller';

export default {
  template,
  controller,
  bindings: {
    ngModel: '=?',
    wallet: '<',
    countryEnum: '<',
    companyKinds: '<',
  },
};
