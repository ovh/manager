import controller from './policies.controller';
import template from './policies.template.html';
import './policies.styles.scss';

export default {
  bindings: {
    advancedMode: '<',
    alert: '<',
    cursors: '<',
    goTo: '<',
    trackClick: '<',
  },
  controller,
  template,
};
