import controller from './onboarding.controller';
import template from './onboarding.template.html';

export default {
  bindings: {
    accountUsersURL: '<',
    advancedMode: '<',
    alert: '<',
    goTo: '<',
    hasPolicies: '<',
    onboardingGuides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
