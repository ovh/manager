import controller from './new-account-form-field.controller';
import template from './new-account-form-field.html';

export default {
  require: {
    newAccountForm: '^newAccountForm',
  },
  bindings: {
    rule: '<', // api rule
    fieldset: '<', // parent form fieldset
  },
  template,
  controller,
};
