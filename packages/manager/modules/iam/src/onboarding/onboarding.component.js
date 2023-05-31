import template from './onboarding.template.html';

export default {
  bindings: {
    advancedMode: '<',
    alert: '<',
    goTo: '<',
    hasPolicies: '<',
    onboardingGuides: '<',
    usersManagementLink: '<',
  },
  template,
};
