import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    activationType: '<',
    currentUser: '<',
    currentService: '<',
    header: '@',
    hasDefaultMeansOfPayment: '<',
    orderableServicePacks: '<',
    servicePacksWithPrices: '<',
    subheader: '@',
  },
  controller,
  require: {
    stepper: '^stepper',
  },
  template,
};
