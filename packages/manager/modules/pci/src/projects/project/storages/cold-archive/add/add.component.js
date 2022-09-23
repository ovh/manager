import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    checkPricesLink: '<',
    stepper: '<',
  },
  controller,
  template,
};
