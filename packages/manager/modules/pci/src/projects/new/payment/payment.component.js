import template from './payment.html';
import controller from './payment.controller';

export default {
  template,
  controller,
  controllerAs: '$ctrl',
  bindings: {
    newProjectModel: '<',
    paymentType: '<',
    getStateLink: '<',
  },
};
