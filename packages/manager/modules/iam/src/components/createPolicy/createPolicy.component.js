import controller from './createPolicy.controller';
import template from './createPolicy.template.html';
import './createPolicy.styles.scss';

export default {
  bindings: {
    alert: '<',
    goBack: '<',
    onboardingGuides: '<',
    policy: '<',
  },
  controller,
  template,
};
