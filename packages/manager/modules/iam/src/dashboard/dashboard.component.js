import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    accountUsersURL: '<',
    onboardingGuides: '<',
    trackClick: '<',
  },
  controller,
  template,
};
