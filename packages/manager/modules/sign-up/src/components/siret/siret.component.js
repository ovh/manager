import template from './siret.html';
import controller from './siret.controller';

export default {
  template,
  controller,
  // slot rendered above the confirmation checkbox (e.g. the e-invoicing picker)
  transclude: true,
  bindings: {
    country: '<',
    model: '=',
    rules: '<',
    trackingMode: '<',
    isValid: '=?',
    formCtrl: '<?',
    onFieldError: '<?',
    onLegalFormChange: '&?',
    mode: '<',
    fieldToFocus: '<',
    isIndianSubsidiary: '<?',
    isFrenchAssociation: '<?',
  },
};
