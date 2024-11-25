import template from './edit-account-form-field-component.html';
import controller from './edit-account-form-field-component.controller';

export default {
  require: {
    domainZoneDashboardContactEdit: '^domainZoneDashboardContactEdit',
  },
  bindings: {
    rule: '<', // api rule
    fieldset: '<', // parent form fieldset,
    contactInformations: '<',
  },
  template,
  controller,
};
