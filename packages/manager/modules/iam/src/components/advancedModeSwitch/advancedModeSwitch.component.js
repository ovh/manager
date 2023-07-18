import controller from './advancedModeSwitch.controller';
import template from './advancedModeSwitch.template.html';

export default {
  bindings: {
    advancedMode: '<',
    alert: '<',
    goTo: '<',
    trackClick: '<',
  },
  template,
  controller,
};
