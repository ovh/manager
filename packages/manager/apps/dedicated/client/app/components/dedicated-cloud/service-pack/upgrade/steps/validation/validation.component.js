import template from './validation.html';

export default {
  bindings: {
    currentService: '<',
  },
  name: 'ovhManagerPccServicePackUpgradeValidation',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
