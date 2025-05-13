import controller from './createPolicy.controller';
import template from './createPolicy.template.html';
import './createPolicy.styles.scss';

export default {
  bindings: {
    alert: '<',
    goTo: '<',
    policiesGuides: '<',
    policy: '<',
    trackClick: '<',
    trackPage: '<',
    permissionsGroups: '<',
  },
  controller,
  template,
};
