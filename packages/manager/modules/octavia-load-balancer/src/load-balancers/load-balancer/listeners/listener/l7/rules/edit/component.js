import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    policyId: '<',
    rule: '<',
    trackL7EditRuleAction: '<',
    trackL7EditRulePage: '<',
    goBackToL7RulesList: '<',
    displayErrorAlert: '<',
  },
  controller,
  template,
};
