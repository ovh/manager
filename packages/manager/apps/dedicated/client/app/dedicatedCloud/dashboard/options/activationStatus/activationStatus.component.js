import controller from './activationStatus.controller';
import template from './activationStatus.html';

export default {
  bindings: {
    statusName: '<',
  },
  controller,
  name: 'ovhManagerComponentActivationStatus',
  template,
};
