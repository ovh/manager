import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    allowedIPsAndBlocks: '<',
    currentService: '<',
    hasDefaultMeansOfPayment: '<',
  },
  controller,
  require: {
    stepper: '^stepper',
  },
  template,
};
