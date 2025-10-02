import controller from './advancedPolicySearch.controller';
import template from './advancedPolicySearch.template.html';

export default {
  bindings: {
    goBack: '<',
    identitiesCriteria: '<',
    resourcesCriteria: '<',
    actionsCriteria: '<',
  },
  controller,
  template,
};
