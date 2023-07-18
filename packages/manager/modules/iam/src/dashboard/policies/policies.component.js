import controller from './policies.controller';
import template from './policies.template.html';

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
