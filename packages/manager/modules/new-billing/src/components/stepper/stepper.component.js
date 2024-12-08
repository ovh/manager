import controller from './stepper.controller';
import template from './stepper.html';

export default {
  bindings: {
    currentStep: '<?',
    steps: '<',
  },
  controller,
  name: 'ovhManagerComponentStepper',
  template,
};
