import controller from './new-account-form-einvoicing.controller';
import template from './new-account-form-einvoicing.html';

export default {
  bindings: {
    model: '=',
    rule: '<',
    siret: '<',
    siretRegex: '<',
    legalForm: '<',
    country: '<',
    onRefreshRules: '&',
  },
  controller,
  template,
};
