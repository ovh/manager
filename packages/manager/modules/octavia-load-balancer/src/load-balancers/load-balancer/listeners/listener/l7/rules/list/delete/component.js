import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    policyId: '<',
    ruleId: '<',
    goBack: '<',
    trackL7RuleDeleteAction: '<',
    trackL7RuleDeletePage: '<',
    displayErrorAlert: '<',
  },
  controller,
  template,
};
