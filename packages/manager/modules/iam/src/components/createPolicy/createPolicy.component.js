import controller from './createPolicy.controller';
import template from './createPolicy.template.html';
import './createPolicy.styles.scss';

export default {
  bindings: {
    alert: '<',
    goTo: '<',
    onboardingGuides: '<',
    policy: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
