import controller from './identities.controller';
import template from './identities.template.html';
import './identities.styles.scss';

export default {
  bindings: {
    alert: '<',
    goBack: '<',
    goTo: '<',
    onboardingGuides: '<',
    policy: '<',
    trackClick: '<',
  },
  controller,
  template,
};
