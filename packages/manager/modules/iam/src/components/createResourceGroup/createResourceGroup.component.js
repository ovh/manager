import controller from './createResourceGroup.controller';
import template from './createResourceGroup.template.html';
import './createResourceGroup.styles.scss';

export default {
  bindings: {
    alert: '<',
    goTo: '<',
    onboardingGuides: '<',
    resourceGroup: '<',
    trackClick: '<',
  },
  controller,
  template,
};
