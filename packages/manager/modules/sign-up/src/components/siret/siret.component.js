import template from './siret.html';
import controller from './siret.controller';

export default {
  template,
  controller,
  // Optional projected content rendered just before the "information is correct"
  // confirmation checkbox (used by the account form to slot the e-invoicing
  // billing address picker inside the pro-info block, above that checkbox).
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
