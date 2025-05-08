import controller from './policies.controller';
import template from './policies.template.html';
import './policies.styles.scss';

export default {
  controller,
  template,
  bindings: {
    policiesGuides: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
