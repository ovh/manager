import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    iamPolicies: '<',
    onboardingGuides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
