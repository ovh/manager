import controller from './policyIdentities.controller';
import template from './policyIdentities.template.html';

export default {
  bindings: {
    alert: '<',
    goBack: '<',
    goTo: '<',
    onboardingGuides: '<',
    policy: '<',
  },
  controller,
  template,
};
