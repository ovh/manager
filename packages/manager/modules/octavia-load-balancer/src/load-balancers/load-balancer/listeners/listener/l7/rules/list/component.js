import template from './template.html';

export default {
  bindings: {
    rules: '<',
    provisioningStatusBadges: '<',
    operatingStatusBadges: '<',
    goToL7RuleCreation: '<',
    goToL7RuleEdition: '<',
    goToL7RuleDeletion: '<',
  },
  template,
};
