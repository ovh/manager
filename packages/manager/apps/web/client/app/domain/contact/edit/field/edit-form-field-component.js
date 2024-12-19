import template from './edit-form-field-component.html';
import controller from './edit-form-field-component.controller';

export default {
  require: {
    domainZoneDashboardContactEdit: '^domainZoneDashboardContactEdit',
  },
  bindings: {
    rule: '<', // api rule
    fieldset: '<', // parent form fieldset,
    contactInformations: '<',
    domainName: '<', // domainName required for order funnel
    rules: '<', // all rules for applying legacy order code
  },
  template,
  controller,
};
