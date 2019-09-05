import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentStep: '<?',
    steps: '<',
  },
  controller,
  template,
};
