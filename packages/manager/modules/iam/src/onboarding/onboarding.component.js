import controller from './onboarding.controller';
import template from './onboarding.template.html';

export default {
  bindings: {
    advancedMode: '<',
    alert: '<',
    goTo: '<',
    // TODO: commented for now, remove when working on policies pages MANAGER-16217
    // hasPolicies: '<',
    onboardingGuides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
