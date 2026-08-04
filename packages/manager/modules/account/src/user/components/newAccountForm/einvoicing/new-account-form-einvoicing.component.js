import controller from './new-account-form-einvoicing.controller';
import template from './new-account-form-einvoicing.html';

export default {
  bindings: {
    model: '=',
    rule: '<',
    siret: '<',
    legalForm: '<',
    country: '<',
    onRefreshRules: '&',
  },
  controller,
  template,
};
