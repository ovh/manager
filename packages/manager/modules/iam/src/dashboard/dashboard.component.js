import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    iamPolicies: '<',
    accountUsersURL: '<',
    onboardingGuides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
