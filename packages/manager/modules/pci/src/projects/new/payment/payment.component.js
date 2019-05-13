import template from './payment.html';
import controller from './payment.controller';

export default {
  template,
  controller,
  controllerAs: '$ctrl',
  bindings: {
    paymentMethodUrl: '<',
    getStepByName: '<',
    getStateLink: '<',
    dlpStatus: '<',
    paymentStatus: '<',
    newProjectInfo: '<',
    hasCreditToOrder: '<',
    creditMinPrice: '<',
  },
};
