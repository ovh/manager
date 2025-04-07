import template from './new-account-form-field-component.html';
import controller from './new-account-form-field-component.controller';

export default {
  require: {
    newAccountForm: '^newAccountForm',
  },
  bindings: {
    rule: '<', // api rule
    fieldset: '<', // parent form fieldset
    isIndianSubsidiary: '<',
    isEditionDisabledByKyc: '<',
  },
  template,
  controller,
};
