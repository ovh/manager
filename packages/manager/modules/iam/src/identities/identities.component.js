import controller from './identities.controller';
import template from './identities.template.html';

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
