import controller from './activation-state-display.controller';
import template from './activation-state-display.html';

export default {
  controller,
  template,
  controllerAs: 'activationStateCtrl',
  bindings: {
    activationState: '<',
  },
};
