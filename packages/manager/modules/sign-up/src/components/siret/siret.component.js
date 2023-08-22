import template from './siret.html';
import controller from './siret.controller';

export default {
  template,
  controller,
  bindings: {
    country: '<',
    model: '=',
    rules: '<',
    trackingMode: '<',
    isValid: '=?',
    formCtrl: '<?',
    onFieldError: '<?',
    mode: '<',
    fieldToFocus: '<',
    isIndianSubsidiary: '<?',
  },
};
