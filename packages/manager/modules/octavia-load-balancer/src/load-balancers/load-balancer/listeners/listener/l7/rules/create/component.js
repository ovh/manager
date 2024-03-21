import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    policyId: '<',
    trackL7CreateRuleAction: '<',
    trackL7CreateRulePage: '<',
    goBackToL7RulesList: '<',
    displayErrorAlert: '<',
  },
  controller,
  template,
};
