import controller from './createResourceGroup.controller';
import template from './createResourceGroup.template.html';
import './createResourceGroup.styles.scss';

export default {
  bindings: {
    alert: '<',
    goTo: '<',
    policiesGuides: '<',
    resourceGroup: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
